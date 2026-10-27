'use client'

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap"

// Drives Lenis from GSAP's ticker so ScrollTrigger and smooth scroll stay in sync.
export function SmoothScroll() {
    useEffect(() => {
        if (prefersReducedMotion()) return

        const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
        lenis.on("scroll", ScrollTrigger.update)

        const tick = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        // Smoothly follow in-page anchor links (e.g. #features, #pricing)
        const onClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]')
            if (!anchor) return
            const url = new URL(anchor.href, window.location.href)
            if (url.pathname !== window.location.pathname || url.hash.length < 2) return
            const target = document.querySelector(url.hash)
            if (!target) return
            e.preventDefault()
            lenis.scrollTo(target as HTMLElement, { offset: -64 })
        }
        document.addEventListener("click", onClick)

        return () => {
            document.removeEventListener("click", onClick)
            gsap.ticker.remove(tick)
            lenis.destroy()
        }
    }, [])

    return null
}
