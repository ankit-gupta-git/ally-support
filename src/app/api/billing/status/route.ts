import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { getSession } from "@/lib/getSession";
import Payment from "@/model/payment.modal";

// Returns the signed-in user's current plan (free when nothing active is paid).
export async function GET() {
    try {
        const session = await getSession()
        const user = session?.user
        if (!user?.id) {
            return NextResponse.json({ plan: "free" }, { status: 200 })
        }

        await connectDB()

        const active = await Payment.findOne({
            ownerId: user.id,
            status: "paid",
            validUntil: { $gt: new Date() }
        }).sort({ validUntil: -1 })

        if (!active) {
            return NextResponse.json({ plan: "free" }, { status: 200 })
        }

        return NextResponse.json({
            plan: active.plan,
            cycle: active.cycle,
            validUntil: active.validUntil
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
