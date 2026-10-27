'use client'

import { useRef, type ReactNode } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { SplitReveal, SectionLabel } from "../ui/motion"

const stepColors = ["var(--color-signal)", "var(--color-sun)", "var(--color-mint)"]

type Step = { step: string; title: string; description: string }

const visuals: ReactNode[] = [
    // 01 — account
    <div key="v1" className="w-full max-w-sm space-y-3">
        <div className="label-mono text-muted-dark">Sign in</div>
        <div className="flex border border-line-dark">
            <span className="flex-1 px-4 py-3 font-mono text-sm text-paper/70">you@company.com</span>
            <span className="grid w-12 place-items-center bg-signal text-paper">→</span>
        </div>
        <div className="label-mono flex items-center gap-2 text-muted-dark">
            <span className="h-1.5 w-1.5 bg-emerald-400" /> Dashboard ready
        </div>
    </div>,
    // 02 — knowledge
    <div key="v2" className="relative w-full max-w-sm overflow-hidden border border-line-dark p-5 font-mono text-[13px] leading-7 text-paper/70">
        <div>• Refund policy: 7 days return</div>
        <div>• Delivery time: 3–5 working days</div>
        <div>• Cash on Delivery available</div>
        <div>• Support hours: 9am – 9pm</div>
        <span data-scan className="absolute inset-x-0 top-0 h-8 border-b border-signal bg-gradient-to-b from-transparent to-signal/20" />
    </div>,
    // 03 — embed
    <pre key="v3" className="w-full max-w-sm overflow-hidden border border-line-dark p-5 font-mono text-[13px] leading-6 text-paper/70">
        <span className="text-signal">&lt;script</span>{"\n"}
        {"  "}src=<span className="text-emerald-300">&quot;/chatBot.js&quot;</span>{"\n"}
        {"  "}data-owner-id=<span className="text-emerald-300">&quot;…&quot;</span><span className="text-signal">&gt;</span>{"\n"}
        <span className="text-signal">&lt;/script&gt;</span>
    </pre>,
]

export function Process({ steps }: { steps: Step[] }) {
    const ref = useRef<HTMLElement>(null)

    useGSAP(() => {
        const mm = gsap.matchMedia()

        gsap.to("[data-scan]", { yPercent: 400, duration: 2.2, ease: "sine.inOut", repeat: -1, yoyo: true })

        mm.add("(min-width: 768px)", () => {
            if (prefersReducedMotion()) return
            const track = ref.current?.querySelector<HTMLElement>("[data-track]")
            if (!track) return

            const distance = () => track.scrollWidth - window.innerWidth
            const scroll = gsap.to(track, {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: {
                    trigger: "[data-pin]",
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => `+=${distance()}`,
                    invalidateOnRefresh: true,
                },
            })

            gsap.fromTo("[data-progress]", { scaleX: 0 }, {
                scaleX: 1,
                ease: "none",
                scrollTrigger: { trigger: "[data-pin]", start: "top top", end: () => `+=${distance()}`, scrub: true },
            })

            gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel, i) => {
                gsap.from(panel.querySelectorAll("[data-panel-in]"), {
                    y: 80,
                    autoAlpha: 0,
                    stagger: 0.1,
                    ease: "none",
                    scrollTrigger: { containerAnimation: scroll, trigger: panel, start: "left 95%", end: "left 45%", scrub: true },
                })
                gsap.fromTo(panel.querySelector("[data-num]"),
                    { color: "transparent" },
                    {
                        color: stepColors[i],
                        ease: "none",
                        scrollTrigger: { containerAnimation: scroll, trigger: panel, start: "left 60%", end: "left 25%", scrub: true },
                    })
            })
        })

        return () => mm.revert()
    }, { scope: ref })

    return (
        <section id="process" ref={ref} className="relative bg-ink text-paper">
            <div data-pin className="relative overflow-hidden md:h-svh">
                <div className="bg-grid-dark absolute inset-0" aria-hidden />

                <div data-track className="relative flex h-full flex-col md:w-max md:flex-row">
                    {/* Intro panel */}
                    <div className="flex shrink-0 flex-col justify-between px-5 pb-12 pt-28 md:w-[46vw] md:px-8 md:pb-16 md:pt-32">
                        <SectionLabel index="02" className="text-paper">Process</SectionLabel>
                        <div className="mt-10 md:mt-0">
                            <SplitReveal className="font-display text-[clamp(2.75rem,6vw,6rem)] leading-[0.9] tracking-[-0.04em]">
                                Setup in minutes,
                                <br />
                                <span className="text-sun">not days.</span>
                            </SplitReveal>
                            <p className="mt-8 max-w-md text-lg leading-relaxed text-paper/60">
                                We&apos;ve simplified the process so you can start automating support immediately.
                            </p>
                        </div>
                        <div className="label-mono mt-10 hidden items-center gap-3 text-paper/50 md:flex">
                            <span className="h-px w-10 bg-paper/40" /> Scroll to explore
                        </div>
                    </div>

                    {steps.map((s, i) => (
                        <article
                            key={s.step}
                            data-panel
                            className="relative flex shrink-0 flex-col justify-between gap-10 border-t border-line-dark px-5 py-14 md:w-[38vw] md:min-w-[440px] md:border-l md:border-t-0 md:px-10 md:pb-16 md:pt-32"
                        >
                            <div className="flex items-start justify-between">
                                <span
                                    data-num
                                    className="font-display text-[clamp(6rem,12vw,11rem)] leading-[0.8] tracking-[-0.05em] text-(--step) md:text-transparent"
                                    style={{ WebkitTextStroke: `1px ${stepColors[i]}`, "--step": stepColors[i] } as React.CSSProperties}
                                >
                                    {s.step}
                                </span>
                                <span className="label-mono text-paper/40">Step {i + 1}/{steps.length}</span>
                            </div>

                            <div data-panel-in className="flex flex-1 items-center">{visuals[i]}</div>

                            <div data-panel-in>
                                <h3 className="font-display text-3xl tracking-tight md:text-4xl">{s.title}</h3>
                                <p className="mt-3 max-w-sm text-lg leading-relaxed text-paper/60">{s.description}</p>
                            </div>
                        </article>
                    ))}

                    {/* Spacer so the last panel can fully enter */}
                    <div className="hidden shrink-0 md:block md:w-[8vw]" />
                </div>

                <div className="absolute inset-x-0 bottom-0 hidden h-px bg-line-dark md:block">
                    <div data-progress className="h-full origin-left bg-signal" />
                </div>
            </div>
        </section>
    )
}
