'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Check } from 'lucide-react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

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

    const content = (
        <div className={`max-w-7xl mx-auto ${showLayout ? 'pt-32 pb-24 px-6' : 'py-24 px-6'}`}>
            <div className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl mb-4"
                >
                    Simple, Transparent Pricing
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-zinc-600 max-w-2xl mx-auto"
                >
                    Choose the plan that best fits your needs. No hidden fees.
                </motion.p>

                {/* Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-10 flex justify-center items-center gap-4"
                >
                    <span className={`text-sm font-medium ${!isAnnual ? 'text-zinc-900' : 'text-zinc-500'}`}>Monthly</span>
                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="relative w-14 h-8 bg-zinc-200 rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
                        role="switch"
                        aria-checked={isAnnual}
                    >
                        <motion.div
                            className="w-6 h-6 bg-white rounded-full shadow-sm"
                            animate={{ x: isAnnual ? 24 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </button>
                    <span className={`text-sm font-medium ${isAnnual ? 'text-zinc-900' : 'text-zinc-500'}`}>
                        Yearly <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full ml-1.5">-20%</span>
                    </span>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {tiers.map((tier, index) => (
                    <motion.div
                        key={tier.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className={`relative rounded-2xl p-8 shadow-lg border ${tier.mostPopular
                            ? 'bg-zinc-900 text-white border-zinc-900 ring-2 ring-zinc-900 ring-offset-2'
                            : 'bg-white text-zinc-900 border-zinc-200'
                            } flex flex-col`}
                    >
                        {tier.mostPopular && (
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-linear-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md hidden">
                                Most Popular {/* Design choice: maybe just a badge inside */}
                            </div>
                        )}
                        {tier.mostPopular && (
                            <div className="absolute top-0 transform -translate-y-1/2 left-1/2 -translate-x-1/2">
                                <span className="inline-block bg-linear-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm tracking-wide uppercase">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className={`text-xl font-bold ${tier.mostPopular ? 'text-white' : 'text-zinc-900'}`}>{tier.name}</h3>
                            <p className={`mt-2 text-sm ${tier.mostPopular ? 'text-zinc-400' : 'text-zinc-500'}`}>{tier.description}</p>
                        </div>

                        <div className="mb-8 flex items-baseline gap-1">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={isAnnual ? 'annual' : 'monthly'}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-4xl font-bold tracking-tight"
                                >
                                    {isAnnual ? tier.priceAnnual : tier.priceMonthly}
                                </motion.span>
                            </AnimatePresence>
                            <span className={`text-sm font-medium ${tier.mostPopular ? 'text-zinc-400' : 'text-zinc-500'}`}>/month</span>
                        </div>

                        <ul role="list" className="mb-8 space-y-4 flex-1">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className={`w-5 h-5 shrink-0 ${tier.mostPopular ? 'text-emerald-400' : 'text-emerald-500'}`} />
                                    <span className={`text-sm ${tier.mostPopular ? 'text-zinc-300' : 'text-zinc-600'}`}>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <a
                            href={tier.href}
                            className={`block w-full py-3 px-4 rounded-xl text-center text-sm font-medium transition-all duration-200 ${tier.mostPopular
                                ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                                : 'bg-zinc-900 text-white hover:bg-zinc-800'
                                }`}
                        >
                            {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                        </a>
                    </motion.div>
                ))}
            </div>
        </div>
    )

    if (!showLayout) return content

    return (
        <div className="min-h-screen bg-zinc-50">
            <Navbar email={email} />
            <main>
                {content}
            </main>
            <Footer />
        </div>
    )
}
