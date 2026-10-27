'use client'

import { useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react"
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap"

/* ---------------------------------------------------------------------------
   SplitReveal — masked line/char reveal for headings.
   `trigger="load"` plays immediately, `trigger="scroll"` waits for viewport.
--------------------------------------------------------------------------- */
type SplitRevealProps<T extends ElementType> = {
    as?: T
    children: ReactNode
    className?: string
    by?: "lines" | "chars" | "words"
    trigger?: "load" | "scroll"
    delay?: number
    stagger?: number
} & Omit<ComponentPropsWithoutRef<T>, "children" | "className">

export function SplitReveal<T extends ElementType = "h2">({
    as,
    children,
    className = "",
    by = "lines",
    trigger = "scroll",
    delay = 0,
    stagger,
    ...rest
}: SplitRevealProps<T>) {
    const Tag = (as || "h2") as ElementType
    const ref = useRef<HTMLElement>(null)

    useGSAP(() => {
        const el = ref.current
        if (!el) return
        if (prefersReducedMotion()) {
            gsap.set(el, { autoAlpha: 1 })
            return
        }

        const split = SplitText.create(el, {
            type: by === "chars" ? "lines,words,chars" : by === "words" ? "lines,words" : "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit(self) {
                gsap.set(el, { autoAlpha: 1 })
                const targets = by === "chars" ? self.chars : by === "words" ? self.words : self.lines
                return gsap.from(targets, {
                    yPercent: 110,
                    rotate: by === "lines" ? 0 : 6,
                    duration: by === "chars" ? 1.1 : 1.3,
                    stagger: stagger ?? (by === "chars" ? 0.018 : by === "words" ? 0.04 : 0.09),
                    delay,
                    ease: "expo.out",
                    scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
                })
            },
        })

        return () => split.revert()
    }, { scope: ref })

    return (
        <Tag ref={ref} className={`invisible ${className}`} {...rest}>
            {children}
        </Tag>
    )
}

/* ---------------------------------------------------------------------------
   ScrubText — words fade from muted to full ink as the block scrolls past.
--------------------------------------------------------------------------- */
export function ScrubText({ children, className = "" }: { children: string; className?: string }) {
    const ref = useRef<HTMLParagraphElement>(null)

    useGSAP(() => {
        const el = ref.current
        if (!el || prefersReducedMotion()) return
        const split = SplitText.create(el, {
            type: "words",
            autoSplit: true,
            onSplit(self) {
                return gsap.fromTo(self.words,
                    { opacity: 0.14 },
                    {
                        opacity: 1,
                        stagger: 0.1,
                        ease: "none",
                        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
                    })
            },
        })
        return () => split.revert()
    }, { scope: ref })

    return <p ref={ref} className={className}>{children}</p>
}

/* ---------------------------------------------------------------------------
   Reveal — fades and lifts direct children with `[data-reveal]` into view.
--------------------------------------------------------------------------- */
export function Reveal({
    children,
    className = "",
    y = 40,
    stagger = 0.08,
    as,
}: {
    children: ReactNode
    className?: string
    y?: number
    stagger?: number
    as?: ElementType
}) {
    const Tag = (as || "div") as ElementType
    const ref = useRef<HTMLElement>(null)

    useGSAP(() => {
        const el = ref.current
        if (!el || prefersReducedMotion()) return
        const items = el.querySelectorAll("[data-reveal]")
        gsap.from(items.length ? items : el, {
            y,
            autoAlpha: 0,
            duration: 1.2,
            stagger,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
        })
    }, { scope: ref })

    return <Tag ref={ref} className={className}>{children}</Tag>
}

/* ---------------------------------------------------------------------------
   Magnetic — element drifts toward the cursor while hovered.
--------------------------------------------------------------------------- */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)

    useGSAP((_, contextSafe) => {
        const el = ref.current
        if (!el || !contextSafe || window.matchMedia("(pointer: coarse)").matches) return

        const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" })
        const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" })

        const move = contextSafe((e: MouseEvent) => {
            const r = el.getBoundingClientRect()
            xTo((e.clientX - (r.left + r.width / 2)) * strength)
            yTo((e.clientY - (r.top + r.height / 2)) * strength)
        })
        const leave = contextSafe(() => { xTo(0); yTo(0) })

        el.addEventListener("mousemove", move)
        el.addEventListener("mouseleave", leave)
        return () => {
            el.removeEventListener("mousemove", move)
            el.removeEventListener("mouseleave", leave)
        }
    }, { scope: ref })

    return <div ref={ref} className={`inline-block ${className}`}>{children}</div>
}

/* ---------------------------------------------------------------------------
   RollText — label that rolls to a duplicate on hover of a `.group` parent.
--------------------------------------------------------------------------- */
export function RollText({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <span className={`relative inline-flex overflow-hidden ${className}`}>
            <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{children}</span>
            <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">{children}</span>
        </span>
    )
}

/* ---------------------------------------------------------------------------
   Button styles — sharp rectangular buttons with a fill that sweeps up on hover.
--------------------------------------------------------------------------- */
const variants = {
    ink: "bg-ink text-paper before:bg-signal",
    paper: "bg-paper text-ink before:bg-signal hover:text-paper",
    outline: "border border-ink/80 text-ink before:bg-ink hover:text-paper",
    "outline-light": "border border-paper/30 text-paper before:bg-paper hover:text-ink",
} as const

export function buttonClass(variant: keyof typeof variants = "ink", size: "sm" | "md" | "lg" = "md") {
    const sizes = { sm: "h-10 px-4 text-sm", md: "h-12 px-6 text-[15px]", lg: "h-16 px-8 text-base" }
    return [
        "group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden font-medium tracking-tight transition-colors duration-500",
        "before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:transition-transform before:duration-500 before:ease-out-expo hover:before:scale-y-100",
        "disabled:pointer-events-none disabled:opacity-50",
        sizes[size],
        variants[variant],
    ].join(" ")
}

export function ArrowGlyph({ className = "" }: { className?: string }) {
    return (
        <span className={`relative inline-flex h-4 w-4 overflow-hidden ${className}`} aria-hidden>
            <svg viewBox="0 0 16 16" className="absolute inset-0 h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-full group-hover:-translate-y-full">
                <path d="M4 12L12 4M12 4H5.5M12 4v6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <svg viewBox="0 0 16 16" className="absolute inset-0 h-4 w-4 -translate-x-full translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0">
                <path d="M4 12L12 4M12 4H5.5M12 4v6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        </span>
    )
}

/* Small mono section marker, e.g. "[02] — Process" */
export function SectionLabel({ index, children, className = "" }: { index: string; children: ReactNode; className?: string }) {
    return (
        <div className={`label-mono flex items-center gap-3 ${className}`}>
            <span className="text-signal">[{index}]</span>
            <span className="h-px w-8 bg-current opacity-30" />
            <span className="opacity-70">{children}</span>
        </div>
    )
}
