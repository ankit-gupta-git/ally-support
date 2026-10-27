'use client'
import { useState } from "react"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import {
  Zap,
  Globe,
  ShieldCheck,
  BarChart3,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Pricing } from "./Pricing"
import { Hero } from "./home/Hero"
import { Marquee } from "./home/Marquee"
import { Manifesto } from "./home/Manifesto"
import { Process } from "./home/Process"
import { Features } from "./home/Features"
import { Testimonials } from "./home/Testimonials"
import { Faq } from "./home/Faq"
import { Cta } from "./home/Cta"

function HomeClient({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useRouter()

  const handleLogin = () => {
    setIsLoading(true)
    window.location.href = '/api/auth/login';
  }

  const goToDashboard = () => {
    setIsLoading(true)
    navigate.push('/dashboard')
  }

  const features = [
    {
      title: "24/7 Availability",
      description: "Ensure your customers receive support at any time of day, boosting satisfaction and loyalty.",
      icon: <Clock />,
    },
    {
      title: "Instant Responses",
      description: "Eliminate wait times with AI that answers common queries in milliseconds.",
      icon: <Zap />,
    },
    {
      title: "Multilingual Support",
      description: "Automatically translate and converse in over 50 languages to reach a global audience.",
      icon: <Globe />,
    },
    {
      title: "Secure & Reliable",
      description: "Enterprise-grade encryption ensures your customer data remains private and protected.",
      icon: <ShieldCheck />,
    },
    {
      title: "Seamless Integration",
      description: "Embed on your website with a single line of code. Works with your existing tools.",
      icon: <CheckCircle2 />,
    },
    {
      title: "Insightful Analytics",
      description: "Track performance, common queries, and user satisfaction with detailed dashboards.",
      icon: <BarChart3 />,
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

  const faqs = [
    { q: "How do I add my website data?", a: "Simply upload your PDF/Word documents or crawl your website URL in the dashboard. Our AI processes it in seconds." },
    { q: "Is there a free trial?", a: "Yes! You can get started for free with our basic plan, which includes 50 conversations per month." },
    { q: "Can I customize the chatbot's look?", a: "Absolutely. You can change the colors, logo, and greeting message to match your brand identity perfectly." },
    { q: "Does it work on mobile?", a: "Yes, the chat widget is fully responsive and works perfectly on all devices, including mobile phones and tablets." }
  ]

  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <Navbar email={email} />

      <Hero email={email} isLoading={isLoading} onLogin={handleLogin} onDashboard={goToDashboard} />

      <Marquee label="Trusted by innovative teams" items={["Acme Corp", "GlobalBank", "TechFlow", "NextGen"]} />

      <Manifesto />

      <Process steps={howItWorks} />

      <Features features={features} />

      <Testimonials testimonials={testimonials} />

      <Faq items={faqs} />

      {/* Pricing Section */}
      <section className="border-t border-line" id="pricing">
        <Pricing email={email} showLayout={false} />
      </section>

      <Cta email={email} onLogin={handleLogin} onDashboard={() => navigate.push('/dashboard')} />

      <Footer />
    </div>
  )
}

export default HomeClient
