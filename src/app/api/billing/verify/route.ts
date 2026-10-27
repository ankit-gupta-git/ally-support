import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { isValidPaymentSignature } from "@/lib/razorpay";
import { CYCLE_DAYS } from "@/lib/plans";
import Payment from "@/model/payment.modal";

const DAY = 24 * 60 * 60 * 1000

// Confirms a checkout by verifying Razorpay's signature, then activates the plan.
// Nothing the client claims is trusted until the signature checks out.
export async function POST(req: NextRequest) {
    try {
        const session = await getSession()
        const user = session?.user
        if (!user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = await req.json()

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        if (!isValidPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
            return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
        }

        await connectDB()

        const payment = await Payment.findOne({ orderId: razorpay_order_id, ownerId: user.id })
        if (!payment) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        // Idempotent: a retried verify call returns the already-activated plan
        if (payment.status !== "paid") {
            // Stack on top of any time left on a currently active plan
            const active = await Payment.findOne({ ownerId: user.id, status: "paid", validUntil: { $gt: new Date() } })
                .sort({ validUntil: -1 })
            const start = active?.validUntil ? active.validUntil.getTime() : Date.now()

            payment.status = "paid"
            payment.paymentId = razorpay_payment_id
            payment.validUntil = new Date(start + CYCLE_DAYS[payment.cycle as "monthly" | "annual"] * DAY)
            await payment.save()
        }

        return NextResponse.json({ plan: payment.plan, validUntil: payment.validUntil }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
