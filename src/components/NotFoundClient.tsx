'use client'

import { useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { Logo } from "./Navbar"
import { ArrowGlyph, RollText } from "./ui/motion"
import { GridTrail } from "./home/GridTrail"

// Pages linked from the footer that aren't built yet. Anything else is a genuine 404.
const PLANNED: Record<string, string> = {
    integrations: "Integrations",
    enterprise: "Enterprise",
    about: "About Us",
    careers: "Careers",
    blog: "Blog",
    contact: "Contact",
    docs: "Documentation",
    help: "Help Center",
    community: "Community",
    terms: "Terms of Service",
    "terms-of-use": "Terms of Use",
    privacy: "Privacy Policy",
}

const exits = [
    { label: "Take me home", href: "/", hint: "Start over" },
    { label: "See pricing", href: "/pricing", hint: "Plans & billing" },
    { label: "Open dashboard", href: "/dashboard", hint: "Train your bot" },
    { label: "Ask the human on X", href: "https://x.com/ankitgupta_79", hint: "@ankitgupta_79", external: true },
]

// Typewriter tween that writes `text` into `el`
function type(el: Element | null, text: string, cps = 55) {
    const state = { n: 0 }
    return gsap.to(state, {
        n: text.length,
        duration: text.length / cps,
        ease: "none",
        onUpdate: () => { if (el) el.textContent = text.slice(0, Math.round(state.n)) },
    })
}

// The "0": the AllySupport speech bubble, with eyes that follow the cursor
function BubbleZero() {
    return (
        <svg data-bubble viewBox="0 0 100 110" className="h-[0.86em] w-auto shrink-0 overflow-visible" aria-hidden>
            <path d="M8 8H92V78H44L22 100V78H8Z" fill="var(--color-signal)" />
            <g data-eyes>
                <circle cx="36" cy="40" r="11" fill="var(--color-paper)" />
                <circle cx="64" cy="40" r="11" fill="var(--color-paper)" />
                <circle data-pupil cx="36" cy="40" r="5" fill="var(--color-ink)" />
                <circle data-pupil cx="64" cy="40" r="5" fill="var(--color-ink)" />
            </g>
            <ellipse data-mouth cx="50" cy="62" rx="5" ry="4" fill="var(--color-ink)" />
        </svg>
    )
}

export default function NotFoundClient() {
    const ref = useRef<HTMLDivElement>(null)
    const pathname = usePathname() || "/"
    const slug = pathname.replace(/^\/+|\/+$/g, "").split("/")[0]
    const pageName = PLANNED[slug]

    const question = pageName ? `Where's the ${pageName} page?` : `Where can I find ${pathname}?`
    const answer = pageName
        ? `I'm not sure about that yet. The ${pageName} page is still in training, so my humans haven't shipped it. Meanwhile, here's where I can take you:`
        : `I'm not sure about that. I searched my whole knowledge base and "${pathname}" isn't in it. Maybe the link is broken? Here's where I can take you:`

    useGSAP((_, contextSafe) => {
        const q = gsap.utils.selector(ref)
        const answerEl = q("[data-answer]")[0]

        if (prefersReducedMotion()) {
            gsap.set(q("[data-msg], [data-exit]"), { autoAlpha: 1 })
            if (answerEl) answerEl.textContent = answer
            return
        }

        // Intro: the 4s rise, the bubble pops in, then the conversation plays out
        const tl = gsap.timeline({ delay: 0.2 })
        tl.from(q("[data-four]"), { yPercent: 110, duration: 1.2, stagger: 0.12, ease: "expo.out" })
            .from(q("[data-bubble]"), { scale: 0, rotate: -25, transformOrigin: "50% 90%", duration: 1.3, ease: "elastic.out(1, 0.55)" }, "-=1")
            .from(q("[data-meta]"), { autoAlpha: 0, y: 12, duration: 0.8, stagger: 0.06 }, "-=0.8")
            .fromTo(q("[data-msg='q']"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.2")
            .fromTo(q("[data-msg='typing']"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "+=0.3")
            .to(q("[data-msg='typing']"), { autoAlpha: 0, duration: 0.2, display: "none" }, "+=1.2")
            .fromTo(q("[data-msg='a']"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 })
            .add(type(answerEl, answer), "<")
            .fromTo(q("[data-exit]"), { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.08 })

        gsap.to(q("[data-dot]"), { y: -3, duration: 0.35, repeat: -1, yoyo: true, stagger: 0.12, ease: "sine.inOut" })

        // Blink every few seconds
        gsap.timeline({ repeat: -1, repeatDelay: 2.8, delay: 2 })
            .to(q("[data-eyes]"), { scaleY: 0.08, transformOrigin: "50% 40px", duration: 0.07, ease: "power1.in" })
            .to(q("[data-eyes]"), { scaleY: 1, duration: 0.12, ease: "power1.out" })

        // Pupils track the cursor; the mouth opens a little when you get close
        if (!contextSafe || window.matchMedia("(pointer: coarse)").matches) return
        const bubble = ref.current?.querySelector<SVGSVGElement>("[data-bubble]")
        const pupils = q("[data-pupil]").map((p) => ({
            x: gsap.quickTo(p, "x", { duration: 0.35, ease: "power3.out" }),
            y: gsap.quickTo(p, "y", { duration: 0.35, ease: "power3.out" }),
        }))
        const mouth = gsap.quickTo(q("[data-mouth]"), "scaleY", { duration: 0.3, ease: "power2.out" })
        gsap.set(q("[data-mouth]"), { transformOrigin: "50px 62px" })

        const move = contextSafe((e: MouseEvent) => {
            if (!bubble) return
            const r = bubble.getBoundingClientRect()
            const dx = e.clientX - (r.left + r.width * 0.5)
            const dy = e.clientY - (r.top + r.height * 0.36)
            const dist = Math.hypot(dx, dy) || 1
            const reach = Math.min(dist / 120, 1) * 5 // max 5 SVG units inside each eye
            pupils.forEach((p) => { p.x((dx / dist) * reach); p.y((dy / dist) * reach) })
            mouth(dist < r.width ? 1.8 : 1)
        })
        window.addEventListener("mousemove", move)
        return () => window.removeEventListener("mousemove", move)
    }, { scope: ref, dependencies: [pathname] })

    return (
        <div ref={ref} className="relative flex min-h-svh flex-col overflow-hidden bg-paper text-ink">
            <div className="bg-grid mask-radial absolute inset-0" aria-hidden />
            <GridTrail className="mask-radial" />

            <header className="relative mx-auto flex h-16 w-full max-w-350 items-center justify-between px-5 md:px-8">
                <Logo />
                <Link href="/" className="group label-mono flex items-center gap-2 text-ink/70 hover:text-ink">
                    <span className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1">←</span>
                    <RollText>Back home</RollText>
                </Link>
            </header>

            <main className="relative mx-auto grid w-full max-w-350 flex-1 grid-cols-1 items-center gap-12 px-5 pb-16 pt-6 md:grid-cols-12 md:gap-8 md:px-8">
                {/* Giant 404 with the bubble as the zero */}
                <div className="md:col-span-7">
                    <div data-meta className="label-mono mb-6 flex items-center gap-3 text-ink/60">
                        <span className="text-signal">[404]</span>
                        <span className="h-px w-8 bg-current opacity-30" />
                        <span className="truncate">{pageName ? "Page in training" : "Not in knowledge base"}</span>
                    </div>
                    <h1 className="flex items-end gap-[0.04em] font-display text-[clamp(7rem,24vw,21rem)] leading-[0.8] tracking-[-0.06em]" aria-label="404, page not found">
                        <span className="overflow-hidden pb-[0.06em]"><span data-four className="block">4</span></span>
                        <BubbleZero />
                        <span className="overflow-hidden pb-[0.06em]"><span data-four className="block">4</span></span>
                    </h1>
                    <p data-meta className="mt-6 max-w-md text-lg leading-relaxed text-ink/60">
                        {pageName
                            ? <>The <span className="text-ink">{pageName}</span> page hasn&apos;t been built yet. Even good support agents don&apos;t know everything.</>
                            : <>This page wandered off. Even a 24/7 support agent can&apos;t find it.</>}
                    </p>
                </div>

                {/* The conversation */}
                <div className="md:col-span-5">
                    <div className="border border-ink bg-paper shadow-[10px_10px_0_0_var(--color-cobalt)]">
                        <div className="label-mono flex items-center justify-between border-b border-ink px-5 py-3.5">
                            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-emerald-500" /> Ally · Online</span>
                            <span className="truncate pl-4 text-muted">{pathname}</span>
                        </div>

                        <div className="bg-dots flex min-h-56 flex-col gap-4 p-5">
                            <div data-msg="q" className="invisible max-w-[85%] self-end bg-cobalt px-4 py-3 text-sm leading-relaxed text-paper">
                                {question}
                            </div>
                            <div data-msg="typing" className="invisible flex gap-1 self-start border border-line bg-paper px-4 py-4">
                                <span data-dot className="h-1.5 w-1.5 bg-ink/60" />
                                <span data-dot className="h-1.5 w-1.5 bg-ink/60" />
                                <span data-dot className="h-1.5 w-1.5 bg-ink/60" />
                            </div>
                            <div data-msg="a" className="invisible max-w-[92%] self-start border-l-2 border-signal bg-paper px-4 py-3 text-sm leading-relaxed">
                                <span data-answer />
                            </div>
                        </div>

                        <nav className="border-t border-ink" aria-label="Where to go next">
                            {exits.map((x, i) => {
                                const inner = (
                                    <>
                                        <span className="flex items-baseline gap-4">
                                            <span className="label-mono text-signal transition-colors group-hover:text-sun">0{i + 1}</span>
                                            <span className="font-medium"><RollText>{x.label}</RollText></span>
                                        </span>
                                        <span className="flex items-center gap-3">
                                            <span className="label-mono hidden text-muted transition-colors group-hover:text-paper/60 sm:inline">{x.hint}</span>
                                            <ArrowGlyph />
                                        </span>
                                    </>
                                )
                                const cls = "group flex items-center justify-between border-b border-line px-5 py-4 transition-colors duration-300 last:border-b-0 hover:bg-ink hover:text-paper"
                                return x.external ? (
                                    <a key={x.href} data-exit href={x.href} target="_blank" rel="noopener noreferrer" className={`invisible ${cls}`}>{inner}</a>
                                ) : (
                                    // No prefetch for /dashboard: logged-out visitors would just get redirected
                                    <Link key={x.href} data-exit href={x.href} prefetch={x.href === "/dashboard" ? false : undefined} className={`invisible ${cls}`}>{inner}</Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>
            </main>
        </div>
    )
}
