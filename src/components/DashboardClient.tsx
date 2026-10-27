'use client'
import { Navbar } from "./Navbar"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import axios from "axios"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { SplitReveal, SectionLabel, RollText, ArrowGlyph, buttonClass } from "./ui/motion"
import { PLANS, type PlanId } from "@/lib/plans"

function DashboardClient({ ownerId, email }: { ownerId: string, email: string }) {
    const [businessName, setBusinessName] = useState("")
    const [supportEmail, setSupportEmail] = useState("")
    const [knowledge, setKnowledge] = useState("")
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    const [initialLoading, setInitialLoading] = useState(true)

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
            } finally {
                setInitialLoading(false)
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

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-paper text-ink">
                <Navbar email={email} dashboard={true} />
                <div className="mx-auto max-w-350 px-5 pt-32 md:px-8 md:pt-40">
                    <div className="animate-pulse space-y-10">
                        <div className="h-3 w-40 bg-paper-2" />
                        <div className="h-20 w-2/3 bg-paper-2" />
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
                            <div className="space-y-8 md:col-span-7">
                                <div className="h-14 bg-paper-2" />
                                <div className="h-14 bg-paper-2" />
                                <div className="h-64 bg-paper-2" />
                            </div>
                            <div className="h-96 bg-paper-2 md:col-span-4 md:col-start-9" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <SettingsView
            email={email}
            businessName={businessName}
            setBusinessName={setBusinessName}
            supportEmail={supportEmail}
            setSupportEmail={setSupportEmail}
            knowledge={knowledge}
            setKnowledge={setKnowledge}
            loading={loading}
            saved={saved}
            onSave={handleSettings}
        />
    )
}

type ViewProps = {
    email: string
    businessName: string
    setBusinessName: (v: string) => void
    supportEmail: string
    setSupportEmail: (v: string) => void
    knowledge: string
    setKnowledge: (v: string) => void
    loading: boolean
    saved: boolean
    onSave: () => void
}

function SettingsView(p: ViewProps) {
    const ref = useRef<HTMLDivElement>(null)
    const pctRef = useRef<HTMLSpanElement>(null)

    // Purely presentational stats derived from the form
    const lines = p.knowledge.split("\n").filter((l) => l.trim()).length
    const words = p.knowledge.trim() ? p.knowledge.trim().split(/\s+/).length : 0
    const checks = [
        { label: "Business name", done: p.businessName.trim().length > 0 },
        { label: "Support email", done: p.supportEmail.trim().length > 0 },
        { label: "Knowledge base", done: p.knowledge.trim().length > 0 },
    ]
    const readiness = Math.round((checks.filter((c) => c.done).length / checks.length) * 100)

    useGSAP(() => {
        if (prefersReducedMotion()) return
        gsap.timeline({ delay: 0.15 })
            .from("[data-rule]", { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.inOut", stagger: 0.08 })
            .from("[data-in]", { y: 30, autoAlpha: 0, stagger: 0.07, duration: 1.1 }, "-=1")
    }, { scope: ref })

    // Readiness number counts toward its new value
    useGSAP(() => {
        const el = pctRef.current
        if (!el) return
        const from = { v: Number(el.dataset.value || 0) }
        gsap.to(from, {
            v: readiness,
            duration: 1,
            ease: "expo.out",
            onUpdate: () => { el.textContent = String(Math.round(from.v)); el.dataset.value = String(from.v) },
        })
        gsap.to("[data-meter]", { scaleX: readiness / 100, duration: 1, ease: "expo.out" })
    }, { scope: ref, dependencies: [readiness] })

    // Confirmation sweep when settings are saved
    useGSAP(() => {
        if (!p.saved) return
        gsap.fromTo("[data-saved]", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "expo.out" })
    }, { scope: ref, dependencies: [p.saved] })

    return (
        <div ref={ref} className="min-h-screen bg-paper text-ink">
            <Navbar email={p.email} dashboard={true} />

            <div className="bg-grid mask-radial pointer-events-none absolute inset-x-0 top-0 h-[60vh]" aria-hidden />

            <main className="relative mx-auto max-w-350 px-5 pb-32 pt-32 md:px-8 md:pt-40">
                {/* Header */}
                <div className="mb-16 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
                    <div>
                        <div data-in><SectionLabel index="00" className="mb-8 text-ink">Dashboard</SectionLabel></div>
                        <SplitReveal as="h1" trigger="load" by="chars" className="font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.9] tracking-[-0.045em]">
                            ChatBot Settings<span className="text-signal">.</span>
                        </SplitReveal>
                        <p data-in className="mt-6 max-w-lg text-lg text-ink/60">Manage your AI chatbot knowledge and business details</p>
                    </div>
                    <div data-in className="label-mono text-left text-muted md:text-right">
                        Workspace
                        <div className="mt-2 font-sans text-sm normal-case tracking-normal text-ink">{p.email}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
                    {/* Form */}
                    <div className="md:col-span-7">
                        {/* Business Details Section */}
                        <section className="relative pt-8">
                            <span data-rule className="absolute inset-x-0 top-0 h-px bg-ink" />
                            <div data-in className="mb-8 flex items-baseline justify-between">
                                <h2 className="font-display text-2xl tracking-tight md:text-3xl">Business Details</h2>
                                <span className="label-mono text-signal">01</span>
                            </div>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div data-in>
                                    <label htmlFor="businessName" className="label-mono text-muted">Business Name</label>
                                    <input
                                        type="text"
                                        id="businessName"
                                        placeholder="Acme Inc."
                                        className="field"
                                        value={p.businessName}
                                        onChange={(e) => p.setBusinessName(e.target.value)}
                                    />
                                </div>
                                <div data-in>
                                    <label htmlFor="supportEmail" className="label-mono text-muted">Support Email</label>
                                    <input
                                        type="email"
                                        id="supportEmail"
                                        placeholder="help@acme.com"
                                        className="field"
                                        value={p.supportEmail}
                                        onChange={(e) => p.setSupportEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Knowledge Base Section */}
                        <section className="relative mt-20 pt-8">
                            <span data-rule className="absolute inset-x-0 top-0 h-px bg-ink" />
                            <div data-in className="mb-2 flex items-baseline justify-between">
                                <h2 className="font-display text-2xl tracking-tight md:text-3xl">Knowledge Base</h2>
                                <span className="label-mono text-cobalt">02</span>
                            </div>
                            <p data-in className="mb-8 text-ink/60">Add FAQs, policies, delivery info, refunds, etc.</p>

                            <div data-in className="group border border-line transition-colors duration-300 focus-within:border-ink">
                                <div className="label-mono flex items-center justify-between border-b border-line px-4 py-3 text-muted transition-colors duration-300 group-focus-within:border-ink">
                                    <label htmlFor="knowledge">knowledge.txt</label>
                                    <span>{lines} lines · {words} words · {p.knowledge.length} chars</span>
                                </div>
                                <textarea
                                    id="knowledge"
                                    data-lenis-prevent
                                    placeholder={`Example:
• Refund policy: 7 days return available
• Delivery time: 3-5 working days
• Cash on Delivery available
• Support hours`}
                                    rows={12}
                                    className="block w-full resize-none bg-transparent px-4 py-4 font-mono text-[14px] leading-7 outline-none placeholder:text-ink/30"
                                    value={p.knowledge}
                                    onChange={(e) => p.setKnowledge(e.target.value)}
                                />
                            </div>
                        </section>

                        {/* Actions */}
                        <div data-in className="mt-10 flex flex-wrap items-center gap-6">
                            <button
                                onClick={p.onSave}
                                disabled={p.loading}
                                className={`${buttonClass("ink", "lg")} min-w-48 justify-between`}
                            >
                                <RollText>{p.loading ? 'Saving...' : 'Save'}</RollText>
                                {p.loading
                                    ? <span className="h-4 w-4 animate-spin border border-paper/30 border-t-paper" />
                                    : <ArrowGlyph />}
                            </button>
                            {p.saved && (
                                <span data-saved className="label-mono flex items-center gap-2 text-emerald-700">
                                    <span className="h-2 w-2 bg-emerald-600" />
                                    Saved successfully!
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Status panel */}
                    <aside className="md:col-span-4 md:col-start-9">
                        <div data-in className="md:sticky md:top-28">
                            <div className="corners border border-ink bg-paper">
                                <div className="label-mono flex items-center justify-between border-b border-ink px-5 py-4">
                                    <span>Bot readiness</span>
                                    <span className={readiness === 100 ? "text-emerald-700" : "text-signal"}>
                                        {readiness === 100 ? "Ready" : "Incomplete"}
                                    </span>
                                </div>

                                <div className="px-5 pb-6 pt-8">
                                    <div className="flex items-end gap-1 font-display leading-none tracking-[-0.05em]">
                                        <span ref={pctRef} className="text-8xl tabular-nums">0</span>
                                        <span className="pb-2 text-3xl text-ink/40">%</span>
                                    </div>
                                    <div className="mt-6 h-1.5 bg-paper-2">
                                        <div data-meter className="h-full origin-left bg-signal" style={{ transform: "scaleX(0)" }} />
                                    </div>
                                </div>

                                <ul className="border-t border-line">
                                    {checks.map((c, i) => (
                                        <li key={c.label} className="flex items-center justify-between border-b border-line px-5 py-4 text-sm">
                                            <span className="flex items-center gap-4">
                                                <span className="label-mono text-muted">0{i + 1}</span>
                                                {c.label}
                                            </span>
                                            <span className={`grid h-5 w-5 place-items-center border transition-colors duration-500 ${c.done ? "border-mint bg-mint text-ink" : "border-line"}`}>
                                                {c.done && (
                                                    <svg viewBox="0 0 12 12" className="h-3 w-3"><path d="M2.5 6.5l2.2 2.2 4.8-5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="grid grid-cols-3 border-b border-line">
                                    {[["Lines", lines], ["Words", words], ["Chars", p.knowledge.length]].map(([k, v]) => (
                                        <div key={k} className="border-r border-line px-5 py-4 last:border-r-0">
                                            <div className="label-mono text-[10px] text-muted">{k}</div>
                                            <div className="mt-2 font-display text-2xl tabular-nums tracking-tight">{v}</div>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/embed" className="group flex items-center justify-between px-5 py-5 transition-colors duration-300 hover:bg-ink hover:text-paper">
                                    <span>
                                        <span className="label-mono block text-muted transition-colors group-hover:text-paper/60">Next step</span>
                                        <span className="mt-2 block text-lg font-medium"><RollText>Embed on your website</RollText></span>
                                    </span>
                                    <ArrowGlyph />
                                </Link>
                            </div>

                            <PlanCard />
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}

// Current subscription, read from the billing API
function PlanCard() {
    const [plan, setPlan] = useState<{ plan: PlanId, validUntil?: string } | null>(null)

    useEffect(() => {
        axios.get("/api/billing/status")
            .then(({ data }) => setPlan(data))
            .catch((error) => console.error("Error fetching plan:", error))
    }, [])

    const isPaid = !!plan && plan.plan !== "free"

    return (
        <div className={`mt-6 border ${isPaid ? "border-cobalt bg-cobalt text-paper" : "border-ink bg-paper"}`}>
            <div className="flex items-center justify-between px-5 py-5">
                <div>
                    <div className={`label-mono ${isPaid ? "text-paper/60" : "text-muted"}`}>Current plan</div>
                    <div className="mt-2 font-display text-3xl tracking-tight">
                        {plan ? PLANS[plan.plan].name : "…"}
                    </div>
                </div>
                {isPaid && plan?.validUntil && (
                    <div className="label-mono text-right text-paper/70">
                        Renews manually
                        <div className="mt-1.5 text-sun">
                            Until {new Date(plan.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                    </div>
                )}
            </div>
            {plan && !isPaid && (
                <Link href="/pricing" className="group flex items-center justify-between border-t border-ink px-5 py-4 text-sm font-medium transition-colors duration-300 hover:bg-cobalt hover:text-paper">
                    <RollText>Upgrade to Pro</RollText>
                    <ArrowGlyph />
                </Link>
            )}
        </div>
    )
}

export default DashboardClient
