'use client'

import axios from "axios"
import type { BillingCycle, PlanId } from "./plans"

type RazorpayResponse = { razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }
type RazorpayInstance = { open: () => void, on: (event: string, cb: (res: { error: { description: string } }) => void) => void }

declare global {
    interface Window {
        Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance
    }
}

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js"

function loadCheckoutScript(): Promise<boolean> {
    if (window.Razorpay) return Promise.resolve(true)
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = SCRIPT_SRC
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

export type CheckoutResult =
    | { status: "paid", plan: PlanId, validUntil: string }
    | { status: "dismissed" }
    | { status: "unauthenticated" }
    | { status: "error", message: string }

// Full flow: create order on the server -> open Razorpay Checkout -> verify signature on the server.
export async function startCheckout(plan: PlanId, cycle: BillingCycle): Promise<CheckoutResult> {
    if (!(await loadCheckoutScript()) || !window.Razorpay) {
        return { status: "error", message: "Couldn't load the payment window. Check your connection." }
    }

    let order: { orderId: string, amount: number, currency: string, keyId: string, email: string }
    try {
        const { data } = await axios.post("/api/billing/order", { plan, cycle })
        order = data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) return { status: "unauthenticated" }
        return { status: "error", message: "Couldn't start checkout. Please try again." }
    }

    return new Promise<CheckoutResult>((resolve) => {
        // Razorpay keeps its window open after a failed attempt so the user can retry,
        // so a failure is only reported if they then close the window.
        let lastError: string | null = null
        const rzp = new window.Razorpay!({
            key: order.keyId,
            order_id: order.orderId,
            amount: order.amount,
            currency: order.currency,
            name: "AllySupport",
            description: `${plan === "pro" ? "Pro" : "Enterprise"} plan, billed ${cycle === "annual" ? "yearly" : "monthly"}`,
            prefill: { email: order.email },
            theme: { color: "#2b44ff" },
            handler: async (response: RazorpayResponse) => {
                try {
                    const { data } = await axios.post("/api/billing/verify", response)
                    resolve({ status: "paid", plan: data.plan, validUntil: data.validUntil })
                } catch {
                    resolve({ status: "error", message: "Payment received but verification failed. Contact support." })
                }
            },
            modal: { ondismiss: () => resolve(lastError ? { status: "error", message: lastError } : { status: "dismissed" }) },
        })
        rzp.on("payment.failed", (res) => {
            lastError = res.error?.description || "Payment failed."
        })
        rzp.open()
    })
}
