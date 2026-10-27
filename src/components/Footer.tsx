'use client'

import { useRef } from "react";
import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { RollText } from "./ui/motion";
import { Logo } from "./Navbar";

const columns = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/#features" },
            { label: "Pricing", href: "/#pricing" },
            { label: "Integrations", href: "#" },
            { label: "Enterprise", href: "#" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About Us", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Contact", href: "#" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "Documentation", href: "#" },
            { label: "Help Center", href: "#" },
            { label: "Community", href: "#" },
            { label: "Terms of Service", href: "#" },
        ],
    },
]

const markHover = ["hover:text-signal", "hover:text-cobalt", "hover:text-sun", "hover:text-mint", "hover:text-lilac"]

export function Footer() {
    const ref = useRef<HTMLElement>(null)

    useGSAP(() => {
        if (prefersReducedMotion()) return
        gsap.from("[data-mark-char]", {
            yPercent: 100,
            stagger: 0.05,
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: "[data-mark]", start: "top 95%", once: true },
        })
    }, { scope: ref })

    return (
        <footer ref={ref} className="relative overflow-hidden border-t border-line bg-paper text-ink">
            <div className="mx-auto grid max-w-350 grid-cols-2 gap-x-6 gap-y-12 px-5 pt-20 md:grid-cols-12 md:px-8 md:pt-28">

                {/* Brand Column */}
                <div className="col-span-2 space-y-6 md:col-span-4">
                    <Logo />
                    <p className="max-w-xs leading-relaxed text-ink/60">
                        Revolutionizing customer support with AI-driven intelligence. Fast, accurate, and always available.
                    </p>
                    <div className="flex">
                        <SocialIcon href="https://x.com/ankitgupta_79" label="Twitter">
                            <Twitter className="h-4 w-4" />
                        </SocialIcon>
                        <SocialIcon href="https://github.com/ankit-gupta-git/ally-support" label="GitHub">
                            <Github className="h-4 w-4" />
                        </SocialIcon>
                        <SocialIcon href="https://www.linkedin.com/in/iamankit-gupta" label="LinkedIn">
                            <Linkedin className="h-4 w-4" />
                        </SocialIcon>
                    </div>
                </div>

                {columns.map((col, i) => (
                    <div key={col.title} className={i === 0 ? "md:col-span-2 md:col-start-7" : "md:col-span-2"}>
                        <h3 className="label-mono mb-6 text-muted">{col.title}</h3>
                        <ul className="space-y-3">
                            {col.links.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="group inline-flex text-ink/80 hover:text-ink">
                                        <RollText>{l.label}</RollText>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mx-auto mt-20 flex max-w-350 flex-col justify-between gap-4 border-t border-line px-5 py-6 text-sm text-ink/50 md:flex-row md:items-center md:px-8">
                <p>&copy; {new Date().getFullYear()} Support.ai. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="#" className="group inline-flex hover:text-ink"><RollText>Privacy Policy</RollText></Link>
                    <Link href="#" className="group inline-flex hover:text-ink"><RollText>Terms of Use</RollText></Link>
                    <a href="#top" className="group inline-flex items-center gap-2 hover:text-ink">
                        <RollText>Back to top ↑</RollText>
                    </a>
                </div>
            </div>

            {/* Oversized wordmark */}
            <div data-mark className="flex cursor-default select-none justify-center overflow-hidden px-2 leading-[0.78]" >
                {"Support.ai".split("").map((c, i) => (
                    <span
                        key={i}
                        data-mark-char
                        aria-hidden
                        className={`inline-block font-display text-[21.5vw] tracking-[-0.06em] transition-colors duration-300 ${c === "." ? "text-signal" : `text-ink ${markHover[i % markHover.length]}`}`}
                    >
                        {c}
                    </span>
                ))}
            </div>
        </footer>
    );
}

function SocialIcon({ href, label, children }: { href: string, label: string, children: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="-ml-px grid h-11 w-11 place-items-center border border-line text-ink/60 transition-colors duration-300 first:ml-0 hover:z-10 hover:border-ink hover:bg-ink hover:text-paper"
        >
            {children}
        </a>
    )
}
