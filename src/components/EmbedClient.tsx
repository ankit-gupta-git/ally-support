'use client'
import { Link, Volume2, MessageCircle, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

function EmbedClient({ ownerId }: { ownerId: string }) {
    const navigate = useRouter()
    const [copied, setCopied] = useState(false)
    const [embedCode, setEmbedCode] = useState("")

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
        const code = `<script 
    src="${baseUrl}/chatBot.js" 
    data-owner-id="${ownerId}">
</script>`
        setEmbedCode(code)
    }, [ownerId])

    const copyCode = () => {
        navigator.clipboard.writeText(embedCode)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate.push('/')}>
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-lg">
                            S
                        </div>
                        <span className="text-lg font-bold tracking-tight text-zinc-900">
                            Support<span className="text-zinc-400">.ai</span>
                        </span>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-12">

                {/* Back Button */}
                <button
                    onClick={() => navigate.push('/dashboard')}
                    className="mb-8 text-sm text-zinc-500 hover:text-zinc-900 flex items-center gap-2 transition-colors"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2">Embed ChatBot</h1>
                    <p className="text-zinc-500 mb-8">Copy and paste this code before the <code className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700 text-sm">&lt;/body&gt;</code> tag of your website.</p>

                    {/* Code Block */}
                    <div className="relative group">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={copyCode}
                                className="px-4 py-2 bg-white text-zinc-900 text-sm font-medium rounded-lg shadow-sm hover:bg-zinc-50 transition-all active:scale-95 flex items-center gap-2"
                            >
                                {copied ? "Copied!" : "Copy Code"}
                            </button>
                        </div>
                        <pre className="bg-zinc-950 text-zinc-100 p-6 rounded-xl overflow-x-auto text-sm font-mono leading-relaxed shadow-inner">
                            <code>{embedCode}</code>
                        </pre>
                    </div>

                    {/* Instructions */}
                    <div className="mt-10 space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-semibold text-sm shrink-0">1</div>
                            <div>
                                <h3 className="font-semibold text-zinc-900">Copy the embed script</h3>
                                <p className="text-zinc-500 text-sm mt-1">Click the copy button above to get your unique chatbot code.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-semibold text-sm shrink-0">2</div>
                            <div>
                                <h3 className="font-semibold text-zinc-900">Paste it in your website</h3>
                                <p className="text-zinc-500 text-sm mt-1">Paste the code just before the closing <code className="bg-zinc-100 px-1 py-0.5 rounded text-xs">&lt;/body&gt;</code> tag in your website's HTML source.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-semibold text-sm shrink-0">3</div>
                            <div>
                                <h3 className="font-semibold text-zinc-900">Reload your website</h3>
                                <p className="text-zinc-500 text-sm mt-1">The chatbot will appear in the bottom-right corner of your site.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Preview */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Live Preview</h2>
                    <p className="text-zinc-500 mb-8">This is how the chatbot will appear on your website</p>

                    <div className="w-full bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden shadow-sm relative h-[500px]">
                        {/* Browser Bar */}
                        <div className="bg-white border-b border-zinc-200 px-4 py-3 flex items-center gap-4">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="flex-1 bg-zinc-100 rounded-md px-3 py-1.5 text-xs text-zinc-400 font-medium text-center">
                                your-website.com
                            </div>
                        </div>

                        {/* Browser Content Placeholder */}
                        <div className="p-8">
                            <div className="w-3/4 h-8 bg-zinc-200/50 rounded-lg mb-4"></div>
                            <div className="w-1/2 h-8 bg-zinc-200/50 rounded-lg mb-12"></div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="h-32 bg-zinc-200/50 rounded-xl"></div>
                                <div className="h-32 bg-zinc-200/50 rounded-xl"></div>
                                <div className="h-32 bg-zinc-200/50 rounded-xl"></div>
                            </div>
                        </div>

                        {/* Chatbot UI Preview */}
                        <div className="absolute bottom-6 right-6 flex flex-col items-end gap-4">

                            {/* Chat Window */}
                            <div className="w-72 bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
                                {/* Header */}
                                <div className="bg-black text-white px-4 py-3 flex justify-between items-center text-sm font-medium">
                                    <span>Customer Support</span>
                                    <X className="w-4 h-4 text-white/70 cursor-pointer hover:text-white transition-colors" />
                                </div>

                                {/* Messages */}
                                <div className="p-4 space-y-3 bg-zinc-50">
                                    <div className="bg-zinc-200 text-zinc-700 px-3 py-2 rounded-xl text-sm w-fit">
                                        hi! how can I help you?
                                    </div>
                                    <div className="bg-black text-white px-3 py-2 rounded-xl text-sm w-fit ml-auto">
                                        what is the return policy?
                                    </div>
                                </div>
                            </div>

                            {/* Chat Bubble */}
                            <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-2xl shadow-black/20 cursor-pointer hover:scale-105 transition-transform">
                                <MessageCircle className="w-7 h-7 text-white" />
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    )
}

export default EmbedClient