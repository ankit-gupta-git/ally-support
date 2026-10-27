// Single source of truth for plan pricing, shared by the pricing UI and the billing API.
// Amounts are in INR (whole rupees). The server derives the charged amount from here,
// never from the client.

export type PlanId = "free" | "pro" | "enterprise"
export type BillingCycle = "monthly" | "annual"

export const PLANS = {
    free: { name: "Free", monthly: 0, annualMonthly: 0, purchasable: false },
    pro: { name: "Pro", monthly: 2499, annualMonthly: 1999, purchasable: true },
    enterprise: { name: "Enterprise", monthly: 7999, annualMonthly: 6499, purchasable: false },
} as const

export const CYCLE_DAYS: Record<BillingCycle, number> = { monthly: 30, annual: 365 }

// Total charged for one billing period, in paise (Razorpay's smallest currency unit)
export function priceInPaise(plan: PlanId, cycle: BillingCycle) {
    const p = PLANS[plan]
    const rupees = cycle === "annual" ? p.annualMonthly * 12 : p.monthly
    return rupees * 100
}

export const formatINR = (rupees: number) => `₹${rupees.toLocaleString("en-IN")}`
