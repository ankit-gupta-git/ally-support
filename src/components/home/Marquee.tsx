'use client'

import { useRef } from "react"
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap"

const tones = ["text-signal", "text-cobalt", "text-mint", "text-sun"]
const hovers = ["hover:text-signal", "hover:text-cobalt", "hover:text-mint", "hover:text-sun"]

// Infinite logo strip that speeds up and reverses with scroll velocity.
export function Marquee({ items, label }: { items: string[]; label: string }) {
    const ref = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (prefersReducedMotion()) return
        const loop = gsap.to("[data-track]", { xPercent: -50, duration: 28, ease: "none", repeat: -1 })

        let dir = 1
        const st = ScrollTrigger.create({
            onUpdate: (self) => {
                if (self.direction !== dir) dir = self.direction
                const boost = Math.min(Math.abs(self.getVelocity()) / 300, 5)
                gsap.to(loop, { timeScale: dir * (1 + boost), duration: 0.2, overwrite: true })
                gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2, ease: "power2.out" })
            },
        })
        return () => st.kill()
    }, { scope: ref })

    const row = [...items, ...items]

    return (
        <section ref={ref} className="relative border-y border-line bg-paper">
            <div className="mx-auto flex max-w-350 items-stretch">
                <div className="label-mono hidden w-56 shrink-0 items-center border-r border-line px-8 text-muted md:flex">
                    {label}
                </div>
                <div className="mask-fade-x relative flex-1 overflow-hidden py-7">
                    <div data-track className="flex w-max">
                        {[0, 1].map((k) => (
                            <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
                                {row.map((name, i) => (
                                    <span key={`${k}-${i}`} className="flex items-center">
                                        <span className={`px-10 font-display text-3xl tracking-tight text-ink/35 transition-colors duration-300 md:text-4xl ${hovers[i % hovers.length]}`}>
                                            {name}
                                        </span>
                                        <svg viewBox="0 0 12 12" className={`h-3 w-3 ${tones[i % tones.length]}`} aria-hidden>
                                            <path d="M6 0v12M0 6h12M1.76 1.76l8.48 8.48M10.24 1.76l-8.48 8.48" stroke="currentColor" strokeWidth="1.4" />
                                        </svg>
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
