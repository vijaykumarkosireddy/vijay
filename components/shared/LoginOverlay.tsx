"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { setCookie, getCookie, deleteCookie } from "@/lib/cookies"

export default function LoginOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginTime, setLoginTime] = useState<number | null>(null)
  const router = useRouter()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.altKey && e.key.toLowerCase() === "a") {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent("trigger-admin-overlay"))
    }
    if (e.key === "Escape") {
      setIsOpen(false)
      setPassword("")
      setError("")
    }
  }, [])

  useEffect(() => {
    const handleTrigger = async () => {
      try {
        const response = await fetch("/api/auth/verify")
        const data = await response.json()

        if (data.authenticated) {
          // Session is valid, redirect to admin
          router.push("/admin")
        } else {
          // Session expired or invalid, show overlay
          setIsOpen(true)
        }
      } catch (error) {
        // Connection error or auth failed, show overlay
        setIsOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("trigger-admin-overlay", handleTrigger)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("trigger-admin-overlay", handleTrigger)
    }
  }, [handleKeyDown, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
      })

      if (res.ok) {
        // API sets httpOnly cookies (admin_auth, admin_token, admin_login_time)
        handleSuccessfulLogin()
      } else {
        const data = await res.json()
        setError(data.error || "Invalid Credentials")
        setPassword("")
      }
    } catch (err) {
      setError("Connection error")
    } finally {
      setLoading(false)
    }
  }

  const handleSuccessfulLogin = () => {
    setIsOpen(false)
    setPassword("")
    setError("")

    // Wait for cookies to be set, then navigate
    setTimeout(() => {
      router.push("/admin")
      setTimeout(() => {
        router.refresh()
      }, 50)
    }, 150)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-fade-in px-4">
      <div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 md:p-10 glass border-gold/20 rounded-2xl sm:rounded-[3rem] animate-scale-in gold-glow">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-[2px] bg-primary mx-auto mb-4 sm:mb-6" />
          <h2 className="text-xl sm:text-2xl font-black tracking-tighter text-white italic">
            ADMIN ACCESS
          </h2>
          <p className="text-[10px] text-gold/40 uppercase tracking-[0.3em] mt-2 font-bold whitespace-nowrap">
            Enter your secret key to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl sm:rounded-2xl border border-white/5 bg-black/60 px-4 sm:px-6 py-3 sm:py-4 text-center text-lg sm:text-xl tracking-widest outline-none focus:border-gold transition-all text-white font-black"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="text-[10px] text-red-500 text-center font-bold uppercase tracking-widest">
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl sm:rounded-2xl bg-primary py-3 sm:py-4 font-black text-xs uppercase tracking-[0.3em] text-primary-foreground transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {loading ? "VERIFYING..." : "GRANT ACCESS"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsOpen(false)
            setError("")
            setPassword("")
            setLoading(false)
          }}
          className="mt-6 sm:mt-8 w-full text-[10px] font-black tracking-[0.4em] text-white/20 hover:text-white/40 uppercase transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
