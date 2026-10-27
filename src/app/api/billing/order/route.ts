import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { getRazorpay } from "@/lib/razorpay";
import { PLANS, priceInPaise, type BillingCycle, type PlanId } from "@/lib/plans";
import Payment from "@/model/payment.modal";

// Creates a Razorpay order for the signed-in user. The amount comes from the
// server-side plan table, so the client can't change what gets charged.
export async function POST(req: NextRequest) {
    try {
        const session = await getSession()
        const user = session?.user
        if (!user?.id) {
            return NextResponse.json({ error: "Please sign in to upgrade" }, { status: 401 })
        }

        const { plan, cycle } = await req.json() as { plan: PlanId, cycle: BillingCycle }

        if (!(plan in PLANS) || !PLANS[plan].purchasable || !["monthly", "annual"].includes(cycle)) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
        }

        const amount = priceInPaise(plan, cycle)
        const order = await getRazorpay().orders.create({
            amount,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            notes: { ownerId: user.id, plan, cycle },
        })

        await connectDB()
        await Payment.create({
            ownerId: user.id,
            plan,
            cycle,
            amount,
            currency: order.currency,
            orderId: order.id,
        })

        return NextResponse.json({
            orderId: order.id,
            amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            email: user.email,
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Could not start checkout" }, { status: 500 })
    }
}
