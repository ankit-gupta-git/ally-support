'use client'

import { useRef } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { SplitReveal, Magnetic, RollText, ArrowGlyph, buttonClass } from "../ui/motion"
import { GridTrail } from "./GridTrail"
import { Shapes } from "./Shapes"

type HeroProps = {
    email: string
    isLoading: boolean
    onLogin: () => void
    onDashboard: () => void
}

const stats = [
    { value: "24/7", label: "Always on", color: "bg-mint" },
    { value: "<1s", label: "Median reply", color: "bg-sun" },
    { value: "50+", label: "Languages", color: "bg-cobalt" },
]

export function Hero({ email, isLoading, onLogin, onDashboard }: HeroProps) {
    const ref = useRef<HTMLElement>(null)

    useGSAP(() => {
        if (prefersReducedMotion()) return
        const tl = gsap.timeline({ delay: 0.2 })
        tl.from("[data-hero-rule]", { scaleX: 0, transformOrigin: "left", duration: 1.6, ease: "expo.inOut", stagger: 0.1 })
            .from("[data-hero-fade]", { y: 24, autoAlpha: 0, stagger: 0.08, duration: 1.2 }, "-=0.9")
            .from("[data-hero-stat]", { yPercent: 100, stagger: 0.08, duration: 1.2 }, "<0.1")

        // Headline drifts up as the hero scrolls away
        gsap.to("[data-hero-title]", {
            yPercent: -18,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        })
    }, { scope: ref })

    return (
        <section ref={ref} className="relative flex min-h-svh flex-col overflow-hidden pt-16">
            {/* Grid background + cursor trail */}
            <div data-hero-grid className="bg-grid mask-radial absolute inset-0" aria-hidden />
            <GridTrail className="mask-radial" />

            <div className="relative mx-auto flex w-full max-w-350 flex-1 flex-col px-5 md:px-8">
                {/* Meta row */}
                <div className="label-mono flex items-center justify-between pt-8 text-ink/60 md:pt-12" data-hero-fade>
                    <span className="flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping bg-signal opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 bg-signal" />
                        </span>
                        New: GPT-4o Integration Available
                    </span>
                    <span className="hidden md:block">AI Customer Support / Embeddable Widget</span>
                </div>

                {/* Headline */}
                <div className="flex flex-1 flex-col justify-center py-14 md:py-10">
                    <div data-hero-title className="relative">
                        <Shapes className="absolute bottom-[-4%] right-0 hidden h-[58%] w-[36%] md:block" />
                        <SplitReveal
                            as="h1"
                            by="chars"
                            trigger="load"
                            delay={0.35}
                            className="relative font-display text-[clamp(3.25rem,11.5vw,11.5rem)] leading-[0.9] tracking-[-0.045em]"
                        >
                            Customer Support,
                            <br />
                            <span className="text-cobalt">Reimagined</span><span className="text-signal">.</span>
                        </SplitReveal>
                    </div>
                </div>

                {/* Bottom rail */}
                <div className="relative grid grid-cols-1 gap-8 pb-10 md:grid-cols-12 md:gap-6 md:pb-12">
                    <span data-hero-rule className="absolute inset-x-0 top-0 h-px bg-ink/80" />

                    <p data-hero-fade className="pt-6 text-lg leading-relaxed text-ink/70 md:col-span-5 md:text-xl">
                        Beautiful tailored AI support that understands your business.
                        Instant responses, 24/7 availability, and seamless integration.
                    </p>

                    <div data-hero-fade className="flex flex-wrap items-start gap-3 md:col-span-4 md:pt-6">
                        <Magnetic strength={0.25}>
                            {email ? (
                                <button onClick={onDashboard} disabled={isLoading} className={buttonClass("ink", "lg")}>
                                    <RollText>{isLoading ? "Loading..." : "Go to Dashboard"}</RollText>
                                    {!isLoading && <ArrowGlyph />}
                                </button>
                            ) : (
                                <button onClick={onLogin} disabled={isLoading} className={buttonClass("ink", "lg")}>
                                    <RollText>{isLoading ? "Please wait..." : "Start for Free"}</RollText>
                                    {!isLoading && <ArrowGlyph />}
                                </button>
                            )}
                        </Magnetic>
                        <a href="#features" className={buttonClass("outline", "lg")}>
                            <RollText>View Demo</RollText>
                        </a>
                    </div>

                    <dl className="grid grid-cols-3 border-l border-line md:col-span-3 md:mt-6">
                        {stats.map((s) => (
                            <div key={s.label} className="overflow-hidden border-r border-line px-3 first:pl-4">
                                <div data-hero-stat>
                                    <dt className="label-mono flex items-center gap-1.5 text-[10px] text-muted"><span className={`h-1.5 w-1.5 ${s.color}`} />{s.label}</dt>
                                    <dd className="mt-2 font-display text-2xl tracking-tight md:text-3xl">{s.value}</dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    )
}
