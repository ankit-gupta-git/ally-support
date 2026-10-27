'use client'
import { MessageCircle, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, type ReactNode } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { Logo } from "./Navbar"
import { SplitReveal, SectionLabel, RollText, Reveal } from "./ui/motion"

// Minimal HTML highlighter for the generated snippet
function highlight(line: string): ReactNode[] {
    const out: ReactNode[] = []
    const re = /(<\/?script)|([\w-]+)(?==)|("[^"]*")|(>)/g
    let last = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(line))) {
        if (m.index > last) out.push(line.slice(last, m.index))
        const cls = m[1] || m[4] ? "text-signal" : m[2] ? "text-sky-300" : "text-emerald-300"
        out.push(<span key={m.index} className={cls}>{m[0]}</span>)
        last = m.index + m[0].length
    }
    if (last < line.length) out.push(line.slice(last))
    return out
}

const stepTones = ["text-signal", "text-cobalt", "text-mint"]

const steps = [
    { title: "Copy the embed script", body: <>Click the copy button above to get your unique chatbot code.</> },
    { title: "Paste it in your website", body: <>Paste the code just before the closing <code className="font-mono text-signal">&lt;/body&gt;</code> tag in your website&apos;s HTML source.</> },
    { title: "Reload your website", body: <>The chatbot will appear in the bottom-right corner of your site.</> },
]

function EmbedClient({ ownerId }: { ownerId: string }) {
    const navigate = useRouter()
    const [copied, setCopied] = useState(false)
    const [embedCode, setEmbedCode] = useState("")
    const ref = useRef<HTMLDivElement>(null)

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

    useGSAP(() => {
        if (prefersReducedMotion()) return
        gsap.timeline({ delay: 0.15 })
            .from("[data-in]", { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1.1 })

        // Live preview: launcher pops, window opens, messages arrive
        gsap.timeline({ scrollTrigger: { trigger: "[data-preview]", start: "top 65%", once: true } })
            .from("[data-site]", { autoAlpha: 0, y: 20, stagger: 0.06, duration: 0.8 })
            .from("[data-launcher]", { scale: 0, rotate: -90, duration: 0.9, ease: "back.out(2)" }, "-=0.3")
            .from("[data-window]", { autoAlpha: 0, y: 30, scale: 0.92, transformOrigin: "bottom right", duration: 0.9 }, "+=0.1")
            .from("[data-msg]", { autoAlpha: 0, y: 10, stagger: 0.5, duration: 0.6 }, "-=0.4")
    }, { scope: ref })

    // Code lines type in once the snippet is generated
    useGSAP(() => {
        if (!embedCode || prefersReducedMotion()) return
        gsap.from("[data-code-line]", { x: -20, autoAlpha: 0, stagger: 0.07, duration: 0.8, delay: 0.5 })
    }, { scope: ref, dependencies: [embedCode] })

    // Copy feedback flash
    useGSAP(() => {
        if (!copied) return
        gsap.fromTo("[data-flash]", { scaleX: 0, transformOrigin: "left" }, { scaleX: 1, duration: 0.5, ease: "expo.out" })
        gsap.to("[data-flash]", { scaleX: 0, transformOrigin: "right", duration: 0.6, delay: 0.5, ease: "expo.in" })
    }, { scope: ref, dependencies: [copied] })

    const codeLines = embedCode ? embedCode.split("\n") : [""]

    return (
        <div ref={ref} className="min-h-screen bg-paper text-ink">
            {/* Header */}
            <div className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-350 items-center justify-between px-5 md:px-8">
                    <Logo />
                    <button
                        onClick={() => navigate.push('/dashboard')}
                        className="group label-mono flex items-center gap-2 text-ink/70 hover:text-ink"
                    >
                        <span className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1">←</span>
                        <RollText>Back to Dashboard</RollText>
                    </button>
                </div>
            </div>

            <div className="bg-grid mask-radial pointer-events-none absolute inset-x-0 top-0 h-[70vh]" aria-hidden />

            <main className="relative mx-auto max-w-350 px-5 pb-32 pt-16 md:px-8 md:pt-24">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
                    <div className="md:col-span-5">
                        <div data-in><SectionLabel index="00" className="mb-8 text-ink">Integration</SectionLabel></div>
                        <SplitReveal as="h1" trigger="load" by="chars" className="font-display text-[clamp(2.75rem,6.5vw,6rem)] leading-[0.9] tracking-[-0.045em]">
                            Embed ChatBot<span className="text-signal">.</span>
                        </SplitReveal>
                        <p data-in className="mt-6 max-w-md text-lg leading-relaxed text-ink/60">
                            Copy and paste this code before the <code className="font-mono text-signal">&lt;/body&gt;</code> tag of your website.
                        </p>
                    </div>

                    {/* Code Block */}
                    <div data-in className="md:col-span-7">
                        <div className="relative overflow-hidden border border-ink bg-ink text-paper shadow-[10px_10px_0_0_var(--color-cobalt)]">
                            <div className="flex items-center justify-between border-b border-line-dark pl-5">
                                <span className="label-mono text-paper/50">index.html</span>
                                <button
                                    onClick={copyCode}
                                    className="group relative flex h-12 items-center gap-2 overflow-hidden border-l border-line-dark px-5 text-sm font-medium transition-colors hover:bg-paper hover:text-ink"
                                >
                                    <span data-flash className="absolute inset-0 origin-left bg-signal" style={{ transform: "scaleX(0)" }} aria-hidden />
                                    <span className="relative"><RollText>{copied ? "Copied!" : "Copy Code"}</RollText></span>
                                </button>
                            </div>
                            <pre className="scroll-thin overflow-x-auto py-6 font-mono text-[13px] leading-7 md:text-sm">
                                <code>
                                    {codeLines.map((line, i) => (
                                        <div key={i} data-code-line className="flex">
                                            <span className="w-12 shrink-0 select-none pr-4 text-right text-paper/25">{i + 1}</span>
                                            <span className="whitespace-pre pr-6">{highlight(line)}</span>
                                        </div>
                                    ))}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <Reveal className="mt-24 grid grid-cols-1 border-t border-ink md:grid-cols-3">
                    {steps.map((s, i) => (
                        <div key={s.title} data-reveal className="border-b border-line py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
                            <div className={`font-display text-6xl leading-none tracking-[-0.05em] ${stepTones[i]}`}>0{i + 1}</div>
                            <h3 className="mt-8 text-xl font-medium tracking-tight">{s.title}</h3>
                            <p className="mt-2 leading-relaxed text-ink/60">{s.body}</p>
                        </div>
                    ))}
                </Reveal>

                {/* Live Preview */}
                <div className="mt-32">
                    <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                        <div>
                            <SectionLabel index="01" className="mb-8 text-ink">Preview</SectionLabel>
                            <SplitReveal className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.92] tracking-[-0.04em]">
                                Live Preview
                            </SplitReveal>
                        </div>
                        <p className="max-w-sm text-ink/60">This is how the chatbot will appear on your website</p>
                    </div>

                    <div data-preview className="relative h-[560px] w-full overflow-hidden border border-ink bg-paper">
                        {/* Browser Bar */}
                        <div className="flex items-center gap-4 border-b border-ink px-4 py-3">
                            <div className="flex gap-1.5">
                                <div className="h-2.5 w-2.5 border border-ink" />
                                <div className="h-2.5 w-2.5 border border-ink" />
                                <div className="h-2.5 w-2.5 bg-ink" />
                            </div>
                            <div className="label-mono flex-1 border border-line px-3 py-2 text-center text-muted">
                                your-website.com
                            </div>
                        </div>

                        {/* Browser Content Placeholder */}
                        <div className="bg-dots h-full p-8">
                            <div data-site className="mb-4 h-8 w-3/4 bg-ink/10" />
                            <div data-site className="mb-12 h-8 w-1/2 bg-ink/10" />

                            <div className="grid grid-cols-3 gap-6">
                                <div data-site className="h-32 bg-ink/[0.06]" />
                                <div data-site className="h-32 bg-ink/[0.06]" />
                                <div data-site className="h-32 bg-ink/[0.06]" />
                            </div>
                        </div>

                        {/* Chatbot UI Preview — mirrors the real widget */}
                        <div className="absolute bottom-6 right-6 flex flex-col items-end gap-4">
                            <div data-window className="w-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
                                <div className="flex items-center justify-between bg-black px-4 py-3 text-sm font-medium text-white">
                                    <span>Customer Support</span>
                                    <X className="h-4 w-4 cursor-pointer text-white/70 transition-colors hover:text-white" />
                                </div>
                                <div className="space-y-3 bg-zinc-50 p-4">
                                    <div data-msg className="w-fit rounded-xl bg-zinc-200 px-3 py-2 text-sm text-zinc-700">
                                        hi! how can I help you?
                                    </div>
                                    <div data-msg className="ml-auto w-fit rounded-xl bg-black px-3 py-2 text-sm text-white">
                                        what is the return policy?
                                    </div>
                                </div>
                            </div>

                            <div data-launcher className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-black shadow-2xl shadow-black/20 transition-transform hover:scale-105">
                                <MessageCircle className="h-7 w-7 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default EmbedClient
