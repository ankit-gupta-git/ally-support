'use client'
import { useState } from "react"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { motion } from "motion/react"
import {
  MessageCircle,
  Zap,
  Globe,
  ShieldCheck,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronDown
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Pricing } from "./Pricing"

function HomeClient({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useRouter()

  const handleLogin = () => {
    setIsLoading(true)
    window.location.href = '/api/auth/login';
  }

  const features = [
    {
      title: "24/7 Availability",
      description: "Ensure your customers receive support at any time of day, boosting satisfaction and loyalty.",
      icon: <Clock className="w-6 h-6 text-zinc-900" />,
    },
    {
      title: "Instant Responses",
      description: "Eliminate wait times with AI that answers common queries in milliseconds.",
      icon: <Zap className="w-6 h-6 text-zinc-900" />,
    },
    {
      title: "Multilingual Support",
      description: "Automatically translate and converse in over 50 languages to reach a global audience.",
      icon: <Globe className="w-6 h-6 text-zinc-900" />,
    },
    {
      title: "Secure & Reliable",
      description: "Enterprise-grade encryption ensures your customer data remains private and protected.",
      icon: <ShieldCheck className="w-6 h-6 text-zinc-900" />,
    },
    {
      title: "Seamless Integration",
      description: "Embed on your website with a single line of code. Works with your existing tools.",
      icon: <CheckCircle2 className="w-6 h-6 text-zinc-900" />,
    },
    {
      title: "Insightful Analytics",
      description: "Track performance, common queries, and user satisfaction with detailed dashboards.",
      icon: <BarChart3 className="w-6 h-6 text-zinc-900" />,
    },
  ]

  const howItWorks = [
    {
      step: "01",
      title: "Create Account",
      description: "Sign up in seconds and access your dedicated dashboard."
    },
    {
      step: "02",
      title: "Train Your AI",
      description: "Upload your docs or FAQs. Our AI learns your business instantly."
    },
    {
      step: "03",
      title: "Embed & Go",
      description: "Paste the widget code on your site and watch support autopilot."
    }
  ]

  const testimonials = [
    {
      quote: "Ally Support transformed our customer service. We reduced response times by 95%!",
      author: "Sarah J.",
      role: "Founder, TechStart"
    },
    {
      quote: "The setup was incredibly easy. We were up and running in less than 10 minutes.",
      author: "Michael B.",
      role: "CTO, Growthly"
    },
    {
      quote: "Our customers love the instant answers. It feels just like talking to a human.",
      author: "Jessica L.",
      role: "Head of Support, OmniShop"
    }
  ]

  return (
    <div className="min-h-screen bg-white text-zinc-900 overflow-x-hidden selection:bg-zinc-100">
      <Navbar email={email} />

      {/* Main Hero Header */}
      <main className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-sm text-zinc-600 mb-8 font-medium">
            <span className="flex relative h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            New: GPT-4o Integration Available
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-8 max-w-5xl mx-auto leading-[1.1] font-(family-name:--font-gyst)">
            Customer Support, <span className="bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-400 bg-clip-text text-transparent">Reimagined.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-500 max-w-3xl mx-auto mb-12 leading-relaxed">
            Beautiful tailored AI support that understands your business. <br className="hidden md:block" />
            Instant responses, 24/7 availability, and seamless integration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {email ? (
              <button
                onClick={() => {
                  setIsLoading(true)
                  navigate.push('/dashboard')
                }}
                disabled={isLoading}
                className="px-8 py-4 rounded-full bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-zinc-900/20 text-lg"
              >
                {isLoading ? "Loading..." : "Go to Dashboard"}
              </button>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="px-8 py-4 rounded-full bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-lg shadow-zinc-900/20 text-lg flex items-center gap-2"
              >
                {isLoading ? "Please wait..." : "Start for Free"}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            )}
            <a href="#features" className="px-8 py-4 rounded-full bg-white text-zinc-900 border border-zinc-200 font-medium hover:bg-zinc-50 transition-colors text-lg">
              View Demo
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-100">
            <p className="text-sm text-zinc-500 mb-6 font-medium">TRUSTED BY INNOVATIVE TEAMS</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Placeholders for logos - simplified text for now */}
              <span className="text-xl font-bold text-zinc-400">Acme Corp</span>
              <span className="text-xl font-bold text-zinc-400">GlobalBank</span>
              <span className="text-xl font-bold text-zinc-400">TechFlow</span>
              <span className="text-xl font-bold text-zinc-400">NextGen</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Hero Visual Section */}
      <section className="pb-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold leading-tight mb-6">
              Not just a chatbot. <br />
              <span className="text-zinc-500">A digital support agent.</span>
            </h2>
            <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
              Ally isn't just a script-reader. It understands context, tone, and intent.
              It can handle complex queries, escalate when necessary, and learn from every interaction to get smarter over time.
            </p>
            <ul className="space-y-4">
              {["Human-like conversation flow", "Connects to your knowledge base", "Customizable brand voice"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-700">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-3xl bg-white shadow-2xl border border-zinc-200/60 p-8 relative z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-900 to-zinc-500"></div>
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900">Support Agent</div>
                    <div className="text-xs text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Online
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-start">
                  <div className="bg-zinc-100 rounded-2xl rounded-tl-none px-5 py-3 text-sm text-zinc-700 max-w-[85%]">
                    Hello! How can I help you with your account today?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-zinc-900 text-white rounded-2xl rounded-tr-none px-5 py-3 text-sm max-w-[85%] shadow-md">
                    I need to upgrade my subscription plan.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-zinc-100 rounded-2xl rounded-tl-none px-5 py-3 text-sm text-zinc-700 max-w-[85%]">
                    Currently, you're on the Basic plan. I can help you upgrade to Pro for $29/mo. Would you like to proceed?
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-zinc-100 relative">
                <div className="h-10 bg-zinc-50 rounded-full w-full opacity-50"></div>
                <div className="absolute right-4 top-6">
                  <div className="w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-zinc-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-zinc-900 text-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">Setup in minutes, not days.</h2>
            <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
              We've simplified the process so you can start automating support immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorks.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="relative"
              >
                <div className="text-8xl font-bold text-zinc-800 opacity-50 absolute -top-10 -left-4 select-none pointer-events-none">
                  {step.step}
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold mb-4 text-zinc-100">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-zinc-50 py-32 px-6" id="features">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold text-zinc-900 mb-6">Power-packed Features</h2>
            <p className="text-xl text-zinc-500 max-w-3xl mx-auto">
              Everything you need to deliver world-class support at scale.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-200/60 hover:shadow-md transition-shadow group"
              >
                <div className="mb-6 w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {/* Render icon if it exists in data, else fallback */}
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-zinc-900">Loved by businesses</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg text-zinc-800 italic mb-6">"{t.quote}"</p>
                <div>
                  <div className="font-bold text-zinc-900">{t.author}</div>
                  <div className="text-sm text-zinc-500">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How do I add my website data?", a: "Simply upload your PDF/Word documents or crawl your website URL in the dashboard. Our AI processes it in seconds." },
              { q: "Is there a free trial?", a: "Yes! You can get started for free with our basic plan, which includes 50 conversations per month." },
              { q: "Can I customize the chatbot's look?", a: "Absolutely. You can change the colors, logo, and greeting message to match your brand identity perfectly." },
              { q: "Does it work on mobile?", a: "Yes, the chat widget is fully responsive and works perfectly on all devices, including mobile phones and tablets." }
            ].map((item, i) => (
              <details key={i} className="group bg-white rounded-xl border border-zinc-200 overflow-hidden open:ring-1 open:ring-zinc-900/5">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-zinc-900 hover:bg-zinc-50 transition-colors">
                  {item.q}
                  <ChevronDown className="w-5 h-5 text-zinc-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-zinc-600 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white border-b border-zinc-200 py-20" id="pricing">
        <Pricing email={email} showLayout={false} />
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-zinc-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-zinc-900 opacity-50"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to transform your support?</h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">Join thousands of forward-thinking businesses using Ally to delight their customers.</p>
          {email ? (
            <button
              onClick={() => navigate.push('/dashboard')}
              className="px-8 py-4 rounded-full bg-white text-zinc-900 font-bold hover:bg-zinc-200 transition-colors text-lg"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="px-8 py-4 rounded-full bg-white text-zinc-900 font-bold hover:bg-zinc-200 transition-colors text-lg"
            >
              Get Started for Free
            </button>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomeClient
