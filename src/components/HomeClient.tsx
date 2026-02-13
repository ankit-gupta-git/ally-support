'use client'
import { useState } from "react"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { motion } from "motion/react"
import { MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Pricing } from "./Pricing"

function HomeClient({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const handleLogin = () => {
    setIsLoading(true)
    window.location.href = '/api/auth/login';
  }

  const features = [
    {
      title: "24/7 Availability",
      description: "Our AI-powered support system is available 24/7, so your customers can get the help they need whenever they need it.",
    },
    {
      title: "Instant Responses",
      description: "Our AI-powered support system handles inquiries instantly, freeing up your team to focus on what matters most.",
    },
    {
      title: "Seamless Integration",
      description: "Our AI-powered support system is easy to integrate with your existing systems, so you can get started quickly.",
    },
  ]

  const navigate = useRouter()


  return (
    <div className="min-h-screen bg-linear-to-br from-white to-zinc-50 text-zinc-900 overflow-x-hidden">
      <Navbar email={email} />

      <main className="pt-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mt-20">
          <h1 className="text-5xl font-(family-name:--font-gyst) tracking-tight text-zinc-900 mb-6">
            Customer Support, <span className="bg-linear-to-r from-zinc-900 via-zinc-600 to-zinc-400
 bg-clip-text text-transparent">Reimagined!</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-10">
            AI-powered support that understands your customers. Instant responses, 24/7 availability, and seamless integration.
          </p>
        </div>
      </main>

      {/* Hero Section */}
      <section className="pt-36 pb-28 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2  gap-20 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:tex:5xl font-semibold leading-tight">
              AI Customer Support <br />
              Built for Modern Business
            </h1>
            <p className="mt-6 text-lg text-zinc-500 max-w-xl">
              Empower your business with intelligent automation. Our AI-powered support system handles inquiries instantly, freeing up your team to focus on what matters most.
            </p>
            <div className="mt-10 flex gap-4">
              {email ? (
                <button
                  onClick={() => {
                    setIsLoading(true)
                    navigate.push('/dashboard')
                  }}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Wait..." : "Go to Dashboard"}
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Wait..." : "Get Started"}
                </button>
              )}
              <a href="#features" className="px-6 py-3 rounded-xl bg-white text-zinc-900 border border-zinc-200 font-medium hover:bg-zinc-50 transition-colors">
                Learn More
              </a>
            </div>

          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative">
            <div className="rounded-2xl bg-white shadow-2xl border border-zinc-200 p-6 relative">
              <div className="text-sm text-zinc-500 mb-3">
                Live Chat Preview
              </div>
              <div className="space-y-3">
                <div className="bg-black text-white rounded-lg px-4 py-2 text-sm ml-auto w-fit">Do you offer cash on delivery?</div>
                <div className="bg-zinc-100 rounded-lg px-4 py-2 text-sm w-fit">Yes, we offer cash on delivery on selected items.</div>

              </div>
              {/* icon animation */}
              <div className="absolute bottom-0 right-0 w-16 h-16">
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -bottom-6 -right-6 w-14 h-14 bg-black text-white flex items-center justify-center shadow-xl rounded-full"
                >
                  <MessageCircle className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-zinc-50 py-28 px-6 border-t border-zinc-200" id="features">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl font-semibold leading-tight text-zinc-900 mb-6">
            Why Business Customers Love Ally Support
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-lg text-zinc-500 mb-6">
            Ally Support is a game-changing AI-powered customer support solution that helps businesses provide faster, more personalized, and more effective responses to their customers. Our advanced AI technology allows us to understand the context of each customer interaction and provide tailored responses that are both helpful and engaging.
          </motion.p>
          <div>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-lg p-6 shadow-md mb-6"
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </section>

      <section className="bg-zinc-50 border-t border-zinc-200" id="pricing">
        <Pricing email={email} showLayout={false} />
      </section>

      <Footer />
    </div>
  )
}

export default HomeClient
