'use client'

import { useRef } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { SplitReveal, Magnetic, RollText } from "../ui/motion"
import { GridTrail } from "./GridTrail"

export function Cta({ email, onLogin, onDashboard }: { email: string; onLogin: () => void; onDashboard: () => void }) {
    const ref = useRef<HTMLElement>(null)

    useGSAP(() => {
        if (prefersReducedMotion()) return
        // Section opens up from an inset frame as it scrolls in
        gsap.fromTo(ref.current, { clipPath: "inset(6% 4% 0% 4%)" }, {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 30%", scrub: true },
        })
        gsap.from("[data-cta-btn]", {
            scale: 0,
            rotate: -45,
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: "[data-cta-btn]", start: "top 90%", once: true },
        })
    }, { scope: ref })

    const label = email ? "Go to Dashboard" : "Get Started for Free"

    return (
        <section ref={ref} className="relative overflow-hidden bg-ink py-28 text-paper md:py-44">
            <div className="bg-grid-dark mask-radial absolute inset-0" aria-hidden />
            <GridTrail dark className="mask-radial" />

            <div className="relative mx-auto flex max-w-350 flex-col items-start gap-14 px-5 md:flex-row md:items-end md:justify-between md:px-8">
                <div className="max-w-4xl">
                    <div className="label-mono mb-10 flex items-center gap-3 text-paper/60">
                        <span className="text-signal">[07]</span><span className="h-px w-8 bg-paper/30" /> Start now
                    </div>
                    <SplitReveal by="words" className="font-display text-[clamp(3rem,8vw,8.5rem)] leading-[0.88] tracking-[-0.045em]">
                        Ready to transform your support?
                    </SplitReveal>
                    <p className="mt-10 max-w-xl text-xl leading-relaxed text-paper/60">
                        Join thousands of forward-thinking businesses using Ally to delight their customers.
                    </p>
                </div>

                <Magnetic strength={0.4} className="shrink-0">
                    <button
                        data-cta-btn
                        onClick={email ? onDashboard : onLogin}
                        className="group relative grid h-44 w-44 place-items-center overflow-hidden rounded-full bg-signal text-paper md:h-56 md:w-56"
                        aria-label={label}
                    >
                        <span className="absolute inset-0 origin-bottom scale-0 rounded-full bg-paper transition-transform duration-700 ease-out-expo group-hover:scale-100" />
                        <span className="relative flex flex-col items-center gap-3 px-6 text-center font-medium leading-tight transition-colors duration-500 group-hover:text-ink">
                            <svg viewBox="0 0 16 16" className="h-6 w-6 transition-transform duration-700 ease-out-expo group-hover:rotate-45">
                                <path d="M4 12L12 4M12 4H5.5M12 4v6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                            </svg>
                            <RollText>{label}</RollText>
                        </span>
                    </button>
                </Magnetic>
            </div>
        </section>
    )
}
