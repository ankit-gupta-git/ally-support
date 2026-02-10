'use client'
import { motion } from "motion/react"
import { Navbar } from "./Navbar"
import { useState, useEffect } from "react"
import axios from "axios"

function DashboardClient({ ownerId, email }: { ownerId: string, email: string }) {
    const [businessName, setBusinessName] = useState("")
    const [supportEmail, setSupportEmail] = useState("")
    const [knowledge, setKnowledge] = useState("")
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.post("/api/auth/settings/get", { ownerId })
                if (data.settings) {
                    setBusinessName(data.settings.businessName || "")
                    setSupportEmail(data.settings.supportEmail || "")
                    setKnowledge(data.settings.knowledge || "")
                }
            } catch (error) {
                console.error("Error fetching settings:", error)
            }
        }

        if (ownerId) {
            fetchSettings()
        }
    }, [ownerId])

    const handleSettings = async () => {
        setLoading(true)
        try {
            const result = await axios.post("/api/auth/settings", { ownerId, businessName, supportEmail, knowledge })
            console.log(result.data)
            setLoading(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (error) {
            console.error("Error updating settings:", error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
            <Navbar email={email} dashboard={true} />

            <div className="mt-20 flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden"
                >
                    <div className="p-8 border-b border-zinc-100">
                        <h1 className="text-2xl font-bold text-zinc-900">ChatBot Settings</h1>
                        <p className="text-zinc-500 mt-1">Manage your AI chatbot knowledge and business details</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Business Details Section */}
                        <section>
                            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Business Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="businessName" className="sr-only">Business Name</label>
                                    <input
                                        type="text"
                                        id="businessName"
                                        placeholder="Business Name"
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none transition-all placeholder:text-zinc-400"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="supportEmail" className="sr-only">Support Email</label>
                                    <input
                                        type="email"
                                        id="supportEmail"
                                        placeholder="Support Email"
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none transition-all placeholder:text-zinc-400"
                                        value={supportEmail}
                                        onChange={(e) => setSupportEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Knowledge Base Section */}
                        <section>
                            <h2 className="text-lg font-semibold text-zinc-900 mb-2">Knowledge Base</h2>
                            <p className="text-sm text-zinc-500 mb-4">Add FAQs, policies, delivery info, refunds, etc.</p>

                            <div className="relative">
                                <textarea
                                    id="knowledge"
                                    placeholder={`Example:
• Refund policy: 7 days return available
• Delivery time: 3-5 working days
• Cash on Delivery available
• Support hours`}
                                    rows={8}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-900 focus:ring-0 outline-none transition-all placeholder:text-zinc-400 resize-none"
                                    value={knowledge}
                                    onChange={(e) => setKnowledge(e.target.value)}
                                />
                            </div>
                        </section>

                        {/* Actions */}
                        <div className="pt-4 flex items-center gap-4">
                            <button
                                onClick={handleSettings}
                                disabled={loading}
                                className="px-8 py-3 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                            {saved && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-green-600 font-medium"
                                >
                                    Saved successfully!
                                </motion.span>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

        </div>
    )
}

export default DashboardClient