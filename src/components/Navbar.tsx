'use client'

import { AnimatePresence, motion } from "motion/react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Menu, X, LayoutDashboard, LogOut, Bot } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"

export function Navbar({ email, dashboard = false }: { email: string, dashboard?: boolean }) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useRouter()

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleLogin = () => {
        setIsLoading(true)
        window.location.href = '/api/auth/login'
    }

    return (
        <>
            <nav
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-6xl rounded-2xl border transition-all duration-300 ${scrolled
                    ? "bg-white/90 backdrop-blur-md border-zinc-200 shadow-lg"
                    : "bg-white/70 backdrop-blur-sm border-transparent"
                    }`}
            >
                <div className="px-6 h-16 flex items-center justify-between">


                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white font-bold text-lg">
                            <Bot className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-zinc-900">
                            Support<span className="text-zinc-400">.ai</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {dashboard ? (
                            <Link
                                href="/embed"
                                className="px-5 py-2 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all duration-200"
                            >
                                Embed Chatbot
                            </Link>
                        ) : email ? (
                            <UserMenu email={email} />
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className="hidden md:block text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors disabled:opacity-50"
                                >
                                    Sign in
                                </button>
                                <button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className="px-5 py-2 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-all duration-200 disabled:opacity-50"
                                >
                                    {isLoading ? "Wait..." : "Get Started"}
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-zinc-600"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-x-4 top-24 z-40 p-4 bg-white rounded-2xl shadow-xl border border-zinc-100 md:hidden"
                    >
                        <div className="flex flex-col gap-2">

                            <div className="h-px bg-zinc-100 my-2" />
                            {!email && (
                                <button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className="w-full p-3 text-center bg-zinc-900 text-white rounded-xl font-medium disabled:opacity-50"
                                >
                                    {isLoading ? "Wait..." : "Sign In"}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
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
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-600 flex items-center justify-center text-white font-semibold ring-2 ring-transparent hover:ring-zinc-200 transition-all active:scale-95"
            >
                {firstLetter}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 p-2 overflow-hidden"
                    >
                        <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Signed in as</p>
                            <p className="text-sm font-medium text-zinc-900 truncate">{email}</p>
                        </div>

                        <Link
                            href="/dashboard"
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>

                        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1" onClick={handleLogOut}>
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
