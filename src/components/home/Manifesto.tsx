'use client'

import { SplitReveal, ScrubText, Reveal, SectionLabel } from "../ui/motion"
import { ChatDemo } from "./ChatDemo"

const markers = ["bg-signal", "bg-cobalt", "bg-mint"]
const points = ["Human-like conversation flow", "Connects to your knowledge base", "Customizable brand voice"]

export function Manifesto() {
    return (
        <section className="relative overflow-hidden py-28 md:py-40">
            <div className="mx-auto grid max-w-350 grid-cols-1 gap-16 px-5 md:grid-cols-12 md:gap-8 md:px-8">
                <div className="md:col-span-5">
                    <SectionLabel index="01" className="mb-10 text-ink">The Agent</SectionLabel>

                    <SplitReveal className="font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.035em]">
                        Not just a chatbot.
                        <br />
                        A <span className="text-signal">digital</span> support agent.
                    </SplitReveal>

                    <ScrubText className="mt-10 max-w-lg text-xl leading-relaxed text-ink md:text-2xl">
                        Ally isn&apos;t just a script-reader. It understands context, tone, and intent. It can handle complex queries, escalate when necessary, and learn from every interaction to get smarter over time.
                    </ScrubText>

                    <Reveal as="ul" className="mt-12 border-t border-line">
                        {points.map((item, i) => (
                            <li
                                key={item}
                                data-reveal
                                className="group flex items-center justify-between border-b border-line py-5 transition-[padding] duration-500 ease-out-expo hover:pl-3"
                            >
                                <span className="flex items-center gap-5">
                                    <span className="label-mono text-muted">0{i + 1}</span>
                                    <span className="text-lg">{item}</span>
                                </span>
                                <span className={`h-3 w-3 transition-transform duration-500 ease-out-expo group-hover:rotate-45 group-hover:scale-125 ${markers[i]}`} />
                            </li>
                        ))}
                    </Reveal>
                </div>

                <div className="relative md:col-span-7 md:col-start-6">
                    <div className="bg-grid corners relative flex overflow-hidden h-full min-h-[560px] items-center justify-center border border-line px-6 py-16 text-ink/40 md:px-16 lg:px-24">
                        <span className="label-mono absolute left-4 top-4 text-muted">Live preview</span>
                        <span className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sun" aria-hidden />
                        <span className="absolute -bottom-10 -left-10 h-40 w-40 bg-lilac" aria-hidden />
                        <span className="label-mono absolute bottom-4 right-4 text-muted">fig. 01</span>
                        <div className="w-full max-w-md text-ink">
                            <ChatDemo />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
