'use client'

import { useRef, useState } from "react"
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { SplitReveal, SectionLabel } from "../ui/motion"

type Testimonial = { quote: string; author: string; role: string }

const DURATION = 6

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
    const ref = useRef<HTMLElement>(null)
    const [active, setActive] = useState(0)
    const prev = useRef(0)
    const splits = useRef<SplitText[]>([])
    const timer = useRef<gsap.core.Tween>(null)
    const observer = useRef<IntersectionObserver>(null)

    // Split every quote into masked lines once; only the active one is shown
    useGSAP(() => {
        const quotes = gsap.utils.toArray<HTMLElement>("[data-quote]")
        splits.current = quotes.map((q, i) =>
            SplitText.create(q, { type: "lines", mask: "lines", linesClass: "split-line", autoSplit: true, onSplit(self) {
                gsap.set(self.lines, { yPercent: i === prev.current ? 0 : 110 })
            } })
        )
        gsap.set(quotes, { autoAlpha: 1 })
        return () => splits.current.forEach((s) => s.revert())
    }, { scope: ref })

    // Swap quotes and run the progress bar that advances to the next one
    useGSAP(() => {
        const from = prev.current
        const to = active
        const out = splits.current[from]?.lines ?? []
        const inc = splits.current[to]?.lines ?? []

        if (from !== to) {
            gsap.to(out, { yPercent: -110, duration: 0.8, stagger: 0.04, ease: "expo.in" })
            gsap.fromTo(inc, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.06, delay: 0.55, ease: "expo.out" })
            prev.current = to
        }

        timer.current?.kill()
        observer.current?.disconnect()
        gsap.set("[data-progress]", { scaleX: 0 })
        if (prefersReducedMotion()) return

        const bar = ref.current?.querySelectorAll("[data-progress]")[to]
        const tween = gsap.fromTo(bar ?? {}, { scaleX: 0 }, {
            scaleX: 1,
            duration: DURATION,
            ease: "none",
            paused: true,
            onComplete: () => setActive((a) => (a + 1) % testimonials.length),
        })
        timer.current = tween
        // Only advance while the section is on screen
        observer.current = new IntersectionObserver(([e]) => (e.isIntersecting ? tween.play() : tween.pause()))
        if (ref.current) observer.current.observe(ref.current)
    }, { scope: ref, dependencies: [active], revertOnUpdate: false })

    useGSAP(() => () => {
        timer.current?.kill()
        observer.current?.disconnect()
    })

    return (
        <section ref={ref} className="relative overflow-hidden bg-cobalt py-28 text-paper md:py-40">
            <div className="mx-auto max-w-350 px-5 md:px-8">
                <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
                    <div>
                        <SectionLabel index="04" className="mb-10 text-paper [&_.text-signal]:text-sun">Testimonials</SectionLabel>
                        <SplitReveal className="font-display text-[clamp(2.75rem,6vw,6rem)] leading-[0.9] tracking-[-0.04em]">
                            Loved by <span className="text-sun">businesses.</span>
                        </SplitReveal>
                    </div>
                    <div className="label-mono flex items-center gap-3 text-paper/70">
                        <span className="tracking-[0.3em] text-sun">★★★★★</span> 5.0 average rating
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
                    {/* Quote stage */}
                    <div className="relative md:col-span-8">
                        <span className="absolute -left-1 -top-10 font-display text-[9rem] leading-none text-sun md:-left-2 md:-top-16 md:text-[14rem]" aria-hidden>
                            &ldquo;
                        </span>
                        <div className="relative grid pt-16 md:pt-20">
                            {testimonials.map((t, i) => (
                                <blockquote
                                    key={t.author}
                                    data-quote
                                    aria-hidden={i !== active}
                                    className="invisible font-display text-[clamp(1.75rem,3.6vw,3.4rem)] leading-[1.08] tracking-[-0.025em] [grid-area:1/1]"
                                >
                                    {t.quote}
                                </blockquote>
                            ))}
                        </div>
                    </div>

                    {/* Author selector */}
                    <div className="border-t border-paper md:col-span-4 md:self-end">
                        {testimonials.map((t, i) => (
                            <button
                                key={t.author}
                                onClick={() => setActive(i)}
                                className={`group relative flex w-full items-center justify-between border-b border-paper/20 py-5 text-left transition-colors duration-300 ${i === active ? "text-paper" : "text-paper/45 hover:text-paper"}`}
                            >
                                <span className="flex items-baseline gap-5">
                                    <span className="label-mono text-sun">0{i + 1}</span>
                                    <span>
                                        <span className="block text-lg font-medium">{t.author}</span>
                                        <span className="mt-0.5 block text-sm opacity-70">{t.role}</span>
                                    </span>
                                </span>
                                <span className={`h-2 w-2 transition-colors duration-300 ${i === active ? "bg-sun" : "bg-current opacity-40"}`} />
                                <span className="absolute inset-x-0 -bottom-px h-px">
                                    <span data-progress className="block h-full origin-left bg-sun" style={{ transform: "scaleX(0)" }} />
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
