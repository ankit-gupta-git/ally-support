'use client'

import { useRef, useState } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { SplitReveal, SectionLabel, RollText, ArrowGlyph, buttonClass } from './ui/motion'

const tiers = [
    {
        name: 'Free',
        id: 'tier-free',
        href: '#',
        priceMonthly: '$0',
        priceAnnual: '$0',
        description: 'Perfect for testing and personal projects.',
        features: ['1 chatbot', '100 messages/month', 'Basic analytics', 'Community support'],
        mostPopular: false,
    },
    {
        name: 'Pro',
        id: 'tier-pro',
        href: '#',
        priceMonthly: '$29',
        priceAnnual: '$24',
        description: 'Ideal for growing businesses and startups.',
        features: [
            '5 chatbots',
            '10,000 messages/month',
            'Advanced analytics',
            'Priority email support',
            'Custom branding',
            'API access',
        ],
        mostPopular: true,
    },
    {
        name: 'Enterprise',
        id: 'tier-enterprise',
        href: '#',
        priceMonthly: '$99',
        priceAnnual: '$79',
        description: 'For large organizations with high volume needs.',
        features: [
            'Unlimited chatbots',
            'Unlimited messages',
            'Real-time analytics',
            '24/7 dedicated support',
            'Custom integrations',
            'SLA agreement',
            'Onboarding assistance'
        ],
        mostPopular: false,
    },
]

export function Pricing({ email, showLayout = true }: { email: string, showLayout?: boolean }) {
    const [isAnnual, setIsAnnual] = useState(true)
    const ref = useRef<HTMLDivElement>(null)
    const first = useRef(true)

    // Cards rise in on scroll
    useGSAP(() => {
        if (prefersReducedMotion()) return
        gsap.from("[data-tier]", {
            y: 80,
            autoAlpha: 0,
            stagger: 0.1,
            duration: 1.3,
            scrollTrigger: { trigger: "[data-tiers]", start: "top 85%", once: true },
        })
        gsap.from("[data-toggle]", { y: 20, autoAlpha: 0, duration: 1, delay: 0.3 })
    }, { scope: ref })

    // Prices roll vertically when billing period changes
    useGSAP(() => {
        if (first.current) { first.current = false; return }
        gsap.fromTo("[data-price]",
            { yPercent: isAnnual ? 100 : -100 },
            { yPercent: 0, duration: 0.8, stagger: 0.05, ease: "expo.out" })
    }, { scope: ref, dependencies: [isAnnual] })

    const content = (
        <div ref={ref} className={`mx-auto max-w-350 px-5 md:px-8 ${showLayout ? 'pb-28 pt-36 md:pt-44' : 'py-28 md:py-40'}`}>
            <div className="mb-16 grid grid-cols-1 gap-10 md:mb-20 md:grid-cols-12 md:items-end">
                <div className="md:col-span-8">
                    <SectionLabel index={showLayout ? "01" : "06"} className="mb-10 text-ink">Pricing</SectionLabel>
                    <SplitReveal
                        as={showLayout ? "h1" : "h2"}
                        trigger={showLayout ? "load" : "scroll"}
                        className="font-display text-[clamp(2.75rem,6vw,6rem)] leading-[0.9] tracking-[-0.04em]"
                    >
                        Simple, transparent
                        <br />
                        <span className="text-mint">pricing.</span>
                    </SplitReveal>
                    <p className="mt-8 max-w-lg text-lg text-ink/60">
                        Choose the plan that best fits your needs. No hidden fees.
                    </p>
                </div>

                {/* Billing toggle */}
                <div data-toggle className="md:col-span-4 md:justify-self-end">
                    <div className="relative grid w-full grid-cols-2 border border-ink md:w-80" role="radiogroup" aria-label="Billing period">
                        <span
                            className="absolute inset-y-0 left-0 w-1/2 bg-ink transition-transform duration-500 ease-out-expo"
                            style={{ transform: `translateX(${isAnnual ? 100 : 0}%)` }}
                            aria-hidden
                        />
                        <button
                            role="radio"
                            aria-checked={!isAnnual}
                            onClick={() => setIsAnnual(false)}
                            className={`relative h-12 text-sm font-medium transition-colors duration-500 ${!isAnnual ? 'text-paper' : 'text-ink'}`}
                        >
                            Monthly
                        </button>
                        <button
                            role="radio"
                            aria-checked={isAnnual}
                            onClick={() => setIsAnnual(true)}
                            className={`relative h-12 text-sm font-medium transition-colors duration-500 ${isAnnual ? 'text-paper' : 'text-ink'}`}
                        >
                            Yearly <span className={`ml-1 font-mono text-xs ${isAnnual ? 'text-signal' : 'text-ink/50'}`}>−20%</span>
                        </button>
                    </div>
                </div>
            </div>

            <div data-tiers className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-3">
                {tiers.map((tier, index) => (
                    <div
                        key={tier.id}
                        data-tier
                        className={`group relative flex flex-col p-8 md:p-10 ${tier.mostPopular ? 'bg-cobalt text-paper' : 'bg-paper text-ink'}`}
                    >
                        {tier.mostPopular && <span className="absolute inset-x-0 top-0 h-1.5 bg-sun" aria-hidden />}

                        <div className="flex items-start justify-between">
                            <span className="label-mono opacity-50">P—0{index + 1}</span>
                            {tier.mostPopular && <span className="label-mono text-sun">Most Popular</span>}
                        </div>

                        <div className="mt-10">
                            <h3 className="font-display text-3xl tracking-tight">{tier.name}</h3>
                            <p className={`mt-3 text-sm ${tier.mostPopular ? 'text-paper/60' : 'text-ink/60'}`}>{tier.description}</p>
                        </div>

                        <div className="mt-10 flex items-end gap-2 border-b border-current/15 pb-10">
                            <span className="inline-flex overflow-hidden">
                                <span data-price className="block font-display text-7xl leading-[0.9] tracking-[-0.05em]">
                                    {isAnnual ? tier.priceAnnual : tier.priceMonthly}
                                </span>
                            </span>
                            <span className={`pb-1.5 text-sm ${tier.mostPopular ? 'text-paper/50' : 'text-ink/50'}`}>/month</span>
                        </div>

                        <ul role="list" className="mb-10 mt-8 flex-1 space-y-3.5">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3 text-sm">
                                    <span className={`h-1.5 w-1.5 shrink-0 ${tier.mostPopular ? 'bg-sun' : 'bg-signal'}`} />
                                    <span className={tier.mostPopular ? 'text-paper/80' : 'text-ink/75'}>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <a
                            href={tier.href}
                            className={`${buttonClass(tier.mostPopular ? 'paper' : 'ink', 'md')} w-full justify-between`}
                        >
                            <RollText>{tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}</RollText>
                            <ArrowGlyph />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )

    if (!showLayout) return content

    return (
        <div className="min-h-screen bg-paper">
            <Navbar email={email} />
            <main className="relative">
                <div className="bg-grid mask-radial pointer-events-none absolute inset-x-0 top-0 h-[70vh]" aria-hidden />
                <div className="relative">{content}</div>
            </main>
            <Footer />
        </div>
    )
}
