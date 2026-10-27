'use client'

import { useEffect, useRef, type ReactNode } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { SplitReveal, SectionLabel } from "../ui/motion"

type Feature = { title: string; description: string; icon: ReactNode }

// Each cell floods with its own colour on hover; light fills keep ink text
const fills = [
    { bg: "bg-cobalt", text: "hover:text-paper", dot: "bg-cobalt" },
    { bg: "bg-signal", text: "hover:text-paper", dot: "bg-signal" },
    { bg: "bg-sun", text: "hover:text-ink", dot: "bg-sun" },
    { bg: "bg-mint", text: "hover:text-ink", dot: "bg-mint" },
    { bg: "bg-lilac", text: "hover:text-ink", dot: "bg-lilac" },
    { bg: "bg-ink", text: "hover:text-paper", dot: "bg-ink" },
]

// Bento layout on a 12-col grid: 7/5, 4/4/4, 12
const spans = [
    "md:col-span-7",
    "md:col-span-5",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-12",
]

function LiveClock() {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const tick = () => { if (ref.current) ref.current.textContent = new Date().toLocaleTimeString([], { hour12: false }) }
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])
    return (
        <div className="mt-10 flex items-end justify-between gap-6">
            <div ref={ref} className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-none tracking-[-0.04em] tabular-nums">--:--:--</div>
            <div className="label-mono pb-2 text-right opacity-60">Your local time<br />Ally is answering</div>
        </div>
    )
}

function Bars() {
    const heights = [38, 52, 44, 70, 58, 82, 64, 90, 76, 95, 72, 88, 98, 84, 92, 100]
    return (
        <div className="mt-10 flex h-28 items-end gap-1.5 md:h-36" data-bars>
            {heights.map((h, i) => (
                <span
                    key={i}
                    data-bar
                    className={`flex-1 origin-bottom ${i === heights.length - 1 ? "bg-signal" : "bg-current opacity-80"}`}
                    style={{ height: `${h}%` }}
                />
            ))}
        </div>
    )
}

function Cell({ feature, index, className }: { feature: Feature; index: number; className: string }) {
    const ref = useRef<HTMLDivElement>(null)
    const fill = fills[index % fills.length]

    // Ink fill slides in from whichever edge the cursor entered
    useGSAP((_, contextSafe) => {
        const el = ref.current
        const fill = el?.querySelector<HTMLElement>("[data-fill]")
        if (!el || !fill || !contextSafe) return

        const edge = (e: MouseEvent) => {
            const r = el.getBoundingClientRect()
            const x = (e.clientX - r.left) / r.width - 0.5
            const y = (e.clientY - r.top) / r.height - 0.5
            // x/y reset the pixel offset GSAP parses from the initial inline translateY(101%)
            return Math.abs(x) > Math.abs(y)
                ? { x: 0, y: 0, xPercent: x > 0 ? 101 : -101, yPercent: 0 }
                : { x: 0, y: 0, xPercent: 0, yPercent: y > 0 ? 101 : -101 }
        }

        const enter = contextSafe((e: MouseEvent) => {
            gsap.fromTo(fill, edge(e), { x: 0, y: 0, xPercent: 0, yPercent: 0, duration: 0.6, ease: "expo.out", overwrite: true })
        })
        const leave = contextSafe((e: MouseEvent) => {
            gsap.to(fill, { ...edge(e), duration: 0.6, ease: "expo.out", overwrite: true })
        })

        el.addEventListener("mouseenter", enter)
        el.addEventListener("mouseleave", leave)
        return () => {
            el.removeEventListener("mouseenter", enter)
            el.removeEventListener("mouseleave", leave)
        }
    }, { scope: ref })

    return (
        <div
            ref={ref}
            data-cell
            className={`group relative isolate flex min-h-[300px] flex-col justify-between overflow-hidden bg-paper p-7 text-ink transition-colors duration-500 md:p-10 ${fill.text} ${className}`}
        >
            <div data-fill className={`absolute inset-0 -z-10 ${fill.bg}`} style={{ transform: "translateY(101%)" }} aria-hidden />

            <div className="flex items-start justify-between">
                <span className="label-mono flex items-center gap-2"><span className={`h-2 w-2 ${fill.dot} transition-colors duration-500 group-hover:bg-current`} /><span className="opacity-50">F—0{index + 1}</span></span>
                <span className="grid h-12 w-12 place-items-center border border-current transition-colors duration-500 group-hover:border-current group-hover:bg-paper group-hover:text-ink [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-current">
                    {feature.icon}
                </span>
            </div>

            {index === 0 && <LiveClock />}
            {index === 5 && <Bars />}

            <div className={index === 5 ? "mt-8 grid gap-4 md:grid-cols-2 md:items-end" : "mt-16"}>
                <h3 className="font-display text-2xl tracking-tight md:text-3xl">{feature.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed opacity-60 transition-opacity duration-500 group-hover:opacity-80">{feature.description}</p>
            </div>
        </div>
    )
}

export function Features({ features }: { features: Feature[] }) {
    const ref = useRef<HTMLElement>(null)

    useGSAP(() => {
        if (prefersReducedMotion()) return
        gsap.from("[data-cell]", {
            y: 60,
            autoAlpha: 0,
            duration: 1.2,
            stagger: { each: 0.08, from: "start" },
            scrollTrigger: { trigger: "[data-grid]", start: "top 80%", once: true },
        })
        gsap.from("[data-bar]", {
            scaleY: 0,
            duration: 1.4,
            stagger: 0.04,
            ease: "expo.out",
            scrollTrigger: { trigger: "[data-bars]", start: "top 90%", once: true },
        })
    }, { scope: ref })

    return (
        <section id="features" ref={ref} className="relative py-28 md:py-40">
            <div className="mx-auto max-w-350 px-5 md:px-8">
                <div className="mb-16 grid grid-cols-1 gap-8 md:mb-24 md:grid-cols-12">
                    <div className="md:col-span-7">
                        <SectionLabel index="03" className="mb-10 text-ink">Capabilities</SectionLabel>
                        <SplitReveal className="font-display text-[clamp(2.75rem,6vw,6rem)] leading-[0.9] tracking-[-0.04em]">
                            Power-packed
                            <br />
                            <span className="text-cobalt">features.</span>
                        </SplitReveal>
                    </div>
                    <p className="self-end text-xl leading-relaxed text-ink/60 md:col-span-4 md:col-start-9">
                        Everything you need to deliver world-class support at scale.
                    </p>
                </div>

                <div data-grid className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-12">
                    {features.map((f, i) => (
                        <Cell key={f.title} feature={f} index={i} className={spans[i] ?? "md:col-span-4"} />
                    ))}
                </div>
            </div>
        </section>
    )
}
