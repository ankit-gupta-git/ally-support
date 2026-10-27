'use client'

import { useRef, useState } from "react"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"
import { SplitReveal, SectionLabel } from "../ui/motion"

type Item = { q: string; a: string }

function Row({ item, index, open, onToggle }: { item: Item; index: number; open: boolean; onToggle: () => void }) {
    const ref = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.to("[data-panel]", {
            height: open ? "auto" : 0,
            duration: 0.7,
            ease: "expo.inOut",
            // Height change shifts everything below, so re-measure scroll triggers
            onComplete: () => ScrollTrigger.refresh(),
        })
        gsap.to("[data-answer]", { y: open ? 0 : -12, autoAlpha: open ? 1 : 0, duration: 0.6, delay: open ? 0.15 : 0 })
    }, { scope: ref, dependencies: [open] })

    return (
        <div ref={ref} className="border-b border-line">
            <button
                onClick={onToggle}
                aria-expanded={open}
                className="group flex w-full items-center justify-between gap-6 py-7 text-left"
            >
                <span className="flex items-baseline gap-6">
                    <span className="label-mono text-signal">Q.0{index + 1}</span>
                    <span className="text-xl font-medium tracking-tight transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-2xl">{item.q}</span>
                </span>
                <span className={`relative grid h-10 w-10 shrink-0 place-items-center border transition-colors duration-300 ${open ? "border-signal bg-signal text-paper" : "border-line group-hover:border-ink"}`}>
                    <span className="absolute h-px w-3.5 bg-current" />
                    <span className={`absolute h-3.5 w-px bg-current transition-transform duration-500 ease-out-expo ${open ? "rotate-90" : ""}`} />
                </span>
            </button>
            <div data-panel className="h-0 overflow-hidden">
                <p data-answer className="invisible max-w-2xl pb-8 pl-0 text-lg leading-relaxed text-ink/60 md:pl-[4.6rem]">{item.a}</p>
            </div>
        </div>
    )
}

export function Faq({ items }: { items: Item[] }) {
    const [open, setOpen] = useState<number | null>(0)

    return (
        <section id="faq" className="relative border-t border-line py-28 md:py-40">
            <div className="mx-auto grid max-w-350 grid-cols-1 gap-12 px-5 md:grid-cols-12 md:gap-8 md:px-8">
                <div className="md:col-span-4">
                    <div className="md:sticky md:top-28">
                        <SectionLabel index="05" className="mb-10 text-ink">FAQ</SectionLabel>
                        <SplitReveal className="font-display text-[clamp(2.5rem,4.6vw,4.5rem)] leading-[0.92] tracking-[-0.04em]">
                            Frequently asked
                            <br />
                            <span className="text-signal">questions.</span>
                        </SplitReveal>
                    </div>
                </div>
                <div className="border-t border-ink md:col-span-7 md:col-start-6">
                    {items.map((item, i) => (
                        <Row key={item.q} item={item} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
                    ))}
                </div>
            </div>
        </section>
    )
}
