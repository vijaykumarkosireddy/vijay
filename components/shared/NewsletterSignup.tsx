"use client"

import { useState } from "react"
import { Mail, Check, Loader2, Sparkles } from "lucide-react"

// Newsletter Signup Component - v2.0
export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      return
    }

    setStatus("loading")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "Successfully subscribed!")
        setEmail("")
        setName("")
      } else {
        setStatus("error")
        if (response.status === 409 && data.existingName) {
          setMessage(`Already subscribed as ${data.existingName || "a subscriber"}`)
        } else {
          setMessage(data.error || "Failed to subscribe. Please try again.")
        }
      }
    } catch (error) {
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gold/5 rounded-full blur-xl"></div>
      <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gold/5 rounded-full blur-lg"></div>

      <div className="relative space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
              Stay Connected
            </h4>
          </div>
          <p className="text-sm text-foreground/60 leading-relaxed font-light">
            Be the first to discover new artworks and musical performances
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 focus:bg-black/60 transition-all duration-300"
            />

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 focus:bg-black/60 transition-all duration-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-gradient-to-r from-gold to-gold/90 text-black font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:from-gold/90 hover:to-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subscribing...
              </>
            ) : status === "success" ? (
              <>
                <Check className="w-4 h-4" />
                Subscribed!
              </>
            ) : (
              "Subscribe Now"
            )}
          </button>

          {/* Messages */}
          {status === "error" && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400">{message}</p>
            </div>
          )}
          {status === "success" && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-400">{message}</p>
            </div>
          )}
        </form>

        {/* Trust indicators */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-foreground/40">
            <span>Join 500+ art lovers</span>
            <span>Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </div>
  )
}
