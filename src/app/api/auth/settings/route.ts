import { NextRequest, NextResponse } from "next/server";
import Settings from "@/model/settings.modal";
import connectDB from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const {
            ownerId,
            businessName,
            supportEmail,
            knowledge
        } = await req.json()

        if (!ownerId) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }

        await connectDB()

        const settings = await Settings.findOneAndUpdate({
            ownerId
        }, {
            businessName,
            supportEmail,
            knowledge
        }, {
            upsert: true,
            new: true
        })

        return NextResponse.json({ settings }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}