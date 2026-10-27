'use client'

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"

const palette = ["var(--color-signal)", "var(--color-cobalt)", "var(--color-sun)", "var(--color-mint)", "var(--color-lilac)"]

// Lights up grid cells under the cursor and lets them fade out, leaving a trail.
// Cell size must match the `bg-grid` background-size (64px).
export function GridTrail({ cell = 64, dark = false, className = "" }: { cell?: number; dark?: boolean; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)

    useGSAP((_, contextSafe) => {
        const root = ref.current
        const host = root?.parentElement
        if (!root || !host || !contextSafe || window.matchMedia("(pointer: coarse)").matches) return

        const pool: HTMLDivElement[] = Array.from({ length: 28 }, () => {
            const d = document.createElement("div")
            d.style.cssText = `position:absolute;width:${cell}px;height:${cell}px;opacity:0;will-change:opacity`
            root.appendChild(d)
            return d
        })
        let i = 0
        let last = ""

        const move = contextSafe((e: MouseEvent) => {
            const r = root.getBoundingClientRect()
            const col = Math.floor((e.clientX - r.left) / cell)
            const row = Math.floor((e.clientY - r.top) / cell)
            const key = `${col}:${row}`
            if (key === last) return
            last = key

            const el = pool[i++ % pool.length]
            // Mostly neutral cells with frequent pops of the brand palette
            const accent = Math.random() < 0.35
            el.style.left = `${col * cell}px`
            el.style.top = `${row * cell}px`
            el.style.background = accent
                ? palette[Math.floor(Math.random() * palette.length)]
                : dark ? "color-mix(in oklab, var(--color-paper) 9%, transparent)" : "color-mix(in oklab, var(--color-ink) 7%, transparent)"
            gsap.fromTo(el, { opacity: 1 }, { opacity: 0, duration: accent ? 1.4 : 1.1, ease: "power2.out", overwrite: true })
        })

        host.addEventListener("mousemove", move)
        return () => {
            host.removeEventListener("mousemove", move)
            pool.forEach((d) => d.remove())
        }
    }, { scope: ref })

    return <div ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} />
}
