'use client'

import { useRef } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"

// Bauhaus-style colour shapes that pop in, idle-float, and parallax with the cursor.
// `depth` controls how far each one drifts relative to the mouse.
const shapes = [
    { cls: "left-[4%] top-[18%] h-[38%] aspect-square rounded-full bg-sun", depth: 18 },
    { cls: "left-[34%] top-[46%] h-[30%] aspect-square bg-cobalt", depth: 34, rotate: 14 },
    { cls: "left-[62%] top-[4%] h-[34%] aspect-square rounded-tl-full bg-mint", depth: 26 },
    { cls: "left-[56%] top-[58%] h-[26%] aspect-square rounded-full border-[3px] border-ink", depth: 44 },
    { cls: "left-[22%] top-[0%] h-[16%] aspect-square bg-lilac rounded-full", depth: 52 },
]

export function Shapes({ className = "" }: { className?: string }) {
    const ref = useRef<HTMLDivElement>(null)

    useGSAP((_, contextSafe) => {
        const root = ref.current
        if (!root || !contextSafe) return
        const items = gsap.utils.toArray<HTMLElement>("[data-shape]")
        const star = root.querySelector("[data-star]")

        if (prefersReducedMotion()) return

        gsap.from([...items, star], {
            scale: 0,
            rotate: -90,
            duration: 1.6,
            stagger: 0.09,
            delay: 0.9,
            ease: "elastic.out(1, 0.6)",
        })
        gsap.to(star, { rotate: 360, duration: 14, repeat: -1, ease: "none" })
        items.forEach((el, i) => {
            gsap.to(el, { yPercent: i % 2 ? 8 : -8, duration: 2.6 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut" })
        })

        if (window.matchMedia("(pointer: coarse)").matches) return
        const movers = items.map((el) => ({
            x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
            y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
            depth: Number(el.dataset.depth),
        }))
        const move = contextSafe((e: MouseEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5
            const ny = e.clientY / window.innerHeight - 0.5
            movers.forEach((m) => { m.x(nx * m.depth * 2); m.y(ny * m.depth * 2) })
        })
        window.addEventListener("mousemove", move)
        return () => window.removeEventListener("mousemove", move)
    }, { scope: ref })

    return (
        <div ref={ref} aria-hidden className={`pointer-events-none ${className}`}>
            <div className="relative h-full w-full">
                {shapes.map((s, i) => (
                    <span
                        key={i}
                        data-shape
                        data-depth={s.depth}
                        className={`absolute mix-blend-multiply ${s.cls}`}
                        style={s.rotate ? { rotate: `${s.rotate}deg` } : undefined}
                    />
                ))}
                <svg data-star viewBox="0 0 24 24" className="absolute left-[80%] top-[52%] h-[22%] text-signal">
                    <path d="M12 0v24M0 12h24M3.5 3.5l17 17M20.5 3.5l-17 17" stroke="currentColor" strokeWidth="2.6" />
                </svg>
            </div>
        </div>
    )
}
