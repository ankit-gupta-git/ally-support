import Link from "next/link";
import { Twitter, Github, Linkedin, Bot } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-zinc-900 text-white py-12 border-t border-zinc-800">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand Column */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-zinc-900 font-bold text-lg">
                            <Bot className="w-5 h-5 text-zinc-900" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            Support<span className="text-zinc-500">.ai</span>
                        </span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Revolutionizing customer support with AI-driven intelligence. Fast, accurate, and always available.
                    </p>
                    <div className="flex gap-4">
                        <SocialIcon href="#" label="Twitter">
                            <Twitter className="w-5 h-5" />
                        </SocialIcon>
                        <SocialIcon href="#" label="GitHub">
                            <Github className="w-5 h-5" />
                        </SocialIcon>
                        <SocialIcon href="#" label="LinkedIn">
                            <Linkedin className="w-5 h-5" />
                        </SocialIcon>
                    </div>
                </div>

                {/* Links Column 1 */}
                <div>
                    <h3 className="font-semibold text-white mb-4">Product</h3>
                    <ul className="space-y-3 text-sm text-zinc-400">
                        <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                        <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Enterprise</Link></li>
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div>
                    <h3 className="font-semibold text-white mb-4">Company</h3>
                    <ul className="space-y-3 text-sm text-zinc-400">
                        <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                </div>

                {/* Links Column 3 */}
                <div>
                    <h3 className="font-semibold text-white mb-4">Resources</h3>
                    <ul className="space-y-3 text-sm text-zinc-400">
                        <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
                <p>&copy; {new Date().getFullYear()} Support.ai. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ href, label, children }: { href: string, label: string, children: React.ReactNode }) {
    return (
        <a
            href={href}
            aria-label={label}
            className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all"
        >
            {children}
        </a>
    )
}
