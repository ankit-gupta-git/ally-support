import Settings from "@/model/settings.modal"
import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import connectDB from "@/lib/db"

export async function POST(req: NextRequest) {
    try {
        const { message, ownerId } = await req.json()
        if (!message || !ownerId) {
            return new NextResponse("Missing message or ownerId", { status: 400 })
        }

        await connectDB()

        const setting = await Settings.findOne({ ownerId })
        if (!setting) {
            return NextResponse.json({ error: "Setting not found. Please configure your chatbot in the dashboard." }, { status: 404 })
        }

        const prompt = `
        You are a friendly AI assistant for ${setting.businessName}.
        Answer user questions based ONLY on the following knowledge base:
        ${setting.knowledge}

        If the answer is not in the knowledge base, politely say:
        "I'm not sure about that. Please contact our support team at ${setting.supportEmail} for assistance."

        Keep responses short and helpful.
        User question: ${message}
        `;

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        async function main() {
            const res = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

            const response = NextResponse.json({ reply: res.text })
            response.headers.set("Access-Control-Allow-Origin", "*")
            response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
            response.headers.set("Access-Control-Allow-Headers", "Content-Type")
            return response
        }


    } catch (error) {
        console.error("Error updating settings:", error)
        return NextResponse.json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
    }

}

export async function OPTIONS(req: NextRequest) {
    const response = NextResponse.json({ reply: "Hello" })
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type")
    return response
}
