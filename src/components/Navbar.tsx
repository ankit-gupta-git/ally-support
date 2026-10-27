'use client'

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { LayoutDashboard, LogOut } from "lucide-react"
import axios from "axios"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap"
import { RollText, buttonClass, ArrowGlyph } from "./ui/motion"

const links = [
    { label: "Features", href: "/#features" },
    { label: "Process", href: "/#process" },
    { label: "Pricing", href: "/#pricing" },
    { label: "FAQ", href: "/#faq" },
]

export function Logo({ light = false }: { light?: boolean }) {
    return (
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Support.ai home">
            <span className={`relative grid h-7 w-7 place-items-center ${light ? "bg-paper" : "bg-ink"}`}>
                <span className="h-2.5 w-2.5 bg-signal transition-transform duration-500 ease-out-expo group-hover:rotate-90 group-hover:scale-125" />
            </span>
            <span className={`font-display text-[19px] leading-none tracking-tight ${light ? "text-paper" : "text-ink"}`}>
                Support<span className="text-signal">.</span>ai
            </span>
        </Link>
    )
}

export function Navbar({ email, dashboard = false }: { email: string, dashboard?: boolean }) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navRef = useRef<HTMLElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const menuTl = useRef<gsap.core.Timeline>(null)

    // Hide on scroll down, reveal on scroll up
    useGSAP(() => {
        const nav = navRef.current
        if (!nav) return
        gsap.from(nav, { yPercent: -100, duration: 1.2, delay: 0.1 })
        const st = ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
                setScrolled(self.scroll() > 10)
                if (self.scroll() < 120) return gsap.to(nav, { yPercent: 0, duration: 0.6, overwrite: true })
                gsap.to(nav, { yPercent: self.direction === 1 ? -100 : 0, duration: 0.6, overwrite: true })
            },
        })
        return () => st.kill()
    }, { scope: navRef })

    // Fullscreen mobile menu timeline
    useGSAP(() => {
        if (!menuRef.current) return
        menuTl.current = gsap.timeline({ paused: true })
            .set(menuRef.current, { display: "flex" })
            .fromTo(menuRef.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "expo.inOut" })
            .from("[data-menu-item]", { yPercent: 120, stagger: 0.06, duration: 1 }, "-=0.35")
    }, { scope: menuRef })

    useEffect(() => {
        const tl = menuTl.current
        if (!tl) return
        if (mobileMenuOpen) tl.timeScale(1).play()
        else tl.timeScale(1.6).reverse()
    }, [mobileMenuOpen])

    const handleLogin = () => {
        setIsLoading(true)
        window.location.href = '/api/auth/login'
    }

    return (
        <>
            <nav
                ref={navRef}
                className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${scrolled || mobileMenuOpen
                    ? "border-b border-line bg-paper/85 backdrop-blur-md"
                    : "border-b border-transparent bg-transparent"
                    }`}
            >
                <div className="mx-auto flex h-16 max-w-350 items-center justify-between px-5 md:px-8">
                    <Logo />

                    {/* Desktop Navigation */}
                    {!dashboard && (
                        <div className="hidden items-center gap-8 md:flex">
                            {links.map((l, i) => (
                                <a key={l.href} href={l.href} className="group label-mono flex items-center gap-1.5 text-ink/70 transition-colors hover:text-ink">
                                    <span className="text-signal">0{i + 1}</span>
                                    <RollText>{l.label}</RollText>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {dashboard ? (
                            <div className="flex items-center gap-3">
                                <Link href="/embed" className={buttonClass("ink", "sm")}>
                                    <RollText>Embed Chatbot</RollText>
                                    <ArrowGlyph />
                                </Link>
                                {email && <UserMenu email={email} />}
                            </div>
                        ) : email ? (
                            <UserMenu email={email} />
                        ) : (
                            <div className="flex items-center gap-5">
                                <button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className="group hidden text-sm font-medium text-ink/70 transition-colors hover:text-ink disabled:opacity-50 md:block"
                                >
                                    <RollText>Sign in</RollText>
                                </button>
                                <button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className={`${buttonClass("ink", "sm")} hidden sm:inline-flex`}
                                >
                                    <RollText>{isLoading ? "Wait..." : "Get Started"}</RollText>
                                    <ArrowGlyph />
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        {!dashboard && (
                            <button
                                className="relative grid h-10 w-10 place-items-center md:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                                aria-expanded={mobileMenuOpen}
                            >
                                <span className={`absolute h-px w-6 bg-ink transition-transform duration-500 ease-out-expo ${mobileMenuOpen ? "rotate-45" : "-translate-y-1"}`} />
                                <span className={`absolute h-px w-6 bg-ink transition-transform duration-500 ease-out-expo ${mobileMenuOpen ? "-rotate-45" : "translate-y-1"}`} />
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                ref={menuRef}
                className="bg-grid fixed inset-0 z-40 hidden flex-col justify-between bg-paper px-5 pb-8 pt-24 md:hidden"
                style={{ clipPath: "inset(0 0 100% 0)" }}
            >
                <div className="flex flex-col">
                    {links.map((l, i) => (
                        <div key={l.href} className="overflow-hidden border-b border-line">
                            <a
                                data-menu-item
                                href={l.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-baseline justify-between py-4"
                            >
                                <span className="font-display text-5xl tracking-tight">{l.label}</span>
                                <span className="label-mono text-signal">0{i + 1}</span>
                            </a>
                        </div>
                    ))}
                </div>
                <div className="overflow-hidden">
                    <div data-menu-item>
                        {email ? (
                            <Link href="/dashboard" className={`${buttonClass("ink", "lg")} w-full`}>
                                <RollText>Open Dashboard</RollText>
                                <ArrowGlyph />
                            </Link>
                        ) : (
                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className={`${buttonClass("ink", "lg")} w-full`}
                            >
                                <RollText>{isLoading ? "Wait..." : "Sign In"}</RollText>
                                <ArrowGlyph />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

function UserMenu({ email }: { email: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const firstLetter = email[0].toUpperCase()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogOut = async () => {
        try {
            const response = await axios.get('/api/auth/logout');
            if (response.status === 200) {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label="Account menu"
                className="group relative grid h-10 w-10 place-items-center overflow-hidden border border-ink bg-paper font-display text-base text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
                {firstLetter}
                <span className="absolute right-0 top-0 h-1.5 w-1.5 bg-signal" />
            </button>

            <div
                className={`absolute right-0 top-full mt-3 w-64 origin-top-right border border-ink bg-paper shadow-[6px_6px_0_0_var(--color-ink)] transition-all duration-300 ease-out-expo ${isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}
            >
                <div className="border-b border-line px-4 py-3">
                    <p className="label-mono text-muted">Signed in as</p>
                    <p className="mt-1.5 truncate text-sm font-medium text-ink">{email}</p>
                </div>

                <Link
                    href="/dashboard"
                    className="group flex w-full items-center justify-between px-4 py-3 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                    <span className="flex items-center gap-3"><LayoutDashboard className="h-4 w-4" /> Dashboard</span>
                    <ArrowGlyph />
                </Link>

                <button className="group flex w-full items-center justify-between border-t border-line px-4 py-3 text-sm text-signal transition-colors hover:bg-signal hover:text-paper" onClick={handleLogOut}>
                    <span className="flex items-center gap-3"><LogOut className="h-4 w-4" /> Sign out</span>
                </button>
            </div>
        </div>
    )
}
