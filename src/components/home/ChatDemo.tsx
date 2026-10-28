'use client'

import { useRef } from "react"
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap"
import { LogoMark } from "../ui/LogoMark"

const script = {
    greet: "Hello! How can I help you with your account today?",
    ask: "I need to upgrade my subscription plan.",
    answer: "Currently, you're on the Basic plan. I can help you upgrade to Pro for $29/mo. Would you like to proceed?",
}

// Typewriter tween: reveals `text` inside `el` one character at a time.
function type(el: Element | null, text: string, cps = 38) {
    const state = { n: 0 }
    return gsap.to(state, {
        n: text.length,
        duration: text.length / cps,
        ease: "none",
        onUpdate: () => { if (el) el.textContent = text.slice(0, Math.round(state.n)) },
    })
}

// A scripted, looping support conversation that only plays while on screen.
export function ChatDemo() {
    const ref = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const q = gsap.utils.selector(ref)
        const input = q("[data-input]")[0]
        const answer = q("[data-answer]")[0]

        if (prefersReducedMotion()) {
            gsap.set(q("[data-bubble]"), { autoAlpha: 1 })
            if (answer) answer.textContent = script.answer
            return
        }

        const pop = { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" }
        const hidden = { autoAlpha: 0, y: 14, scale: 0.96 }

        const tl = gsap.timeline({
            repeat: -1,
            repeatDelay: 2.4,
            scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom top", toggleActions: "play pause resume pause" },
        })

        tl.call(() => {
            if (input) input.textContent = ""
            if (answer) answer.textContent = ""
        }, [], 0)
            .fromTo(q("[data-bubble='greet']"), hidden, pop, 0.3)
            .add(type(input, script.ask), "+=0.6")
            .call(() => { if (input) input.textContent = "" })
            .fromTo(q("[data-send]"), { scale: 1 }, { scale: 0.85, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" }, "<")
            .fromTo(q("[data-bubble='ask']"), hidden, pop, "<0.1")
            .fromTo(q("[data-callout='intent']"), { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.8 }, "<0.3")
            .fromTo(q("[data-bubble='typing']"), hidden, pop, "<0.2")
            .to(q("[data-bubble='typing']"), { autoAlpha: 0, duration: 0.2 }, "+=1.1")
            .fromTo(q("[data-bubble='answer']"), hidden, pop)
            .add(type(answer, script.answer, 70), "<")
            .fromTo(q("[data-callout='time']"), { autoAlpha: 0, x: 12 }, { autoAlpha: 1, x: 0, duration: 0.8 }, "<0.4")
            .to(q("[data-bubble], [data-callout]"), { autoAlpha: 0, y: -8, duration: 0.6, stagger: 0.04, ease: "power2.in" }, "+=3.2")

        // Animated typing dots
        gsap.to(q("[data-dot]"), { y: -3, duration: 0.35, repeat: -1, yoyo: true, stagger: 0.12, ease: "sine.inOut" })
    }, { scope: ref })

    return (
        <div ref={ref} className="relative">
            {/* Callouts */}
            <div data-callout="intent" className="invisible absolute -left-4 top-[38%] z-20 hidden -translate-x-full items-center gap-2 lg:flex">
                <span className="label-mono whitespace-nowrap bg-paper px-2 py-1.5 text-ink">Intent <span className="text-signal">upgrade_plan</span></span>
                <span className="h-px w-10 bg-ink" />
                <span className="h-1.5 w-1.5 bg-ink" />
            </div>
            <div data-callout="time" className="invisible absolute -right-4 bottom-[26%] z-20 hidden translate-x-full items-center gap-2 lg:flex">
                <span className="h-1.5 w-1.5 bg-ink" />
                <span className="h-px w-10 bg-ink" />
                <span className="label-mono whitespace-nowrap bg-paper px-2 py-1.5 text-ink">Resolved in <span className="text-signal">0.8s</span></span>
            </div>

            <div className="relative z-10 border border-ink bg-paper shadow-[10px_10px_0_0_var(--color-cobalt)]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-ink px-5 py-4">
                    <div className="flex items-center gap-3">
                        <LogoMark className="h-9 w-9" />
                        <div>
                            <div className="text-sm font-semibold">Support Agent</div>
                            <div className="label-mono mt-1 flex items-center gap-1.5 text-[10px] text-muted">
                                <span className="h-1.5 w-1.5 bg-emerald-500" /> Online
                            </div>
                        </div>
                    </div>
                    <span className="label-mono text-[10px] text-muted">Session 2048</span>
                </div>

                {/* Messages */}
                <div className="bg-dots flex h-[340px] flex-col gap-4 p-5">
                    <div data-bubble="greet" className="invisible max-w-[82%] self-start border border-line bg-paper px-4 py-3 text-sm leading-relaxed">
                        {script.greet}
                    </div>
                    <div data-bubble="ask" className="invisible max-w-[82%] self-end bg-cobalt px-4 py-3 text-sm leading-relaxed text-paper">
                        {script.ask}
                    </div>
                    <div className="grid max-w-[82%] self-start">
                        <div data-bubble="typing" className="invisible flex gap-1 self-start justify-self-start border border-line bg-paper px-4 py-4 [grid-area:1/1]">
                            <span data-dot className="h-1.5 w-1.5 bg-ink/60" />
                            <span data-dot className="h-1.5 w-1.5 bg-ink/60" />
                            <span data-dot className="h-1.5 w-1.5 bg-ink/60" />
                        </div>
                        <div data-bubble="answer" className="invisible border-l-2 border-signal bg-paper px-4 py-3 text-sm leading-relaxed [grid-area:1/1]">
                            <span data-answer />
                        </div>
                    </div>
                </div>

                {/* Composer */}
                <div className="flex items-center gap-3 border-t border-ink px-5 py-3">
                    <div className="min-h-5 flex-1 truncate text-sm text-ink/80">
                        <span data-input className="caret" />
                    </div>
                    <div data-send className="grid h-9 w-9 place-items-center bg-signal text-paper">
                        <svg viewBox="0 0 16 16" className="h-4 w-4"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                    </div>
                </div>
            </div>
        </div>
    )
}
