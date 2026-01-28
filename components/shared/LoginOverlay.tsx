"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

export default function LoginOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Alt + A shortcut
    if (e.altKey && e.key.toLowerCase() === "a") {
      setIsOpen(true)
    }
    if (e.key === "Escape") {
      setIsOpen(false)
      setPassword("")
      setError("")
    }
  }, [])

  useEffect(() => {
    const handleTrigger = () => setIsOpen(true)
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("trigger-admin-overlay", handleTrigger)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("trigger-admin-overlay", handleTrigger)
    }
  }, [handleKeyDown])

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
        localStorage.setItem("admin_auth", "true")
        setIsOpen(false)
        router.push("/admin")
      } else {
        setError("Invalid Credentials")
        setPassword("")
      }
    } catch (err) {
      setError("Connection error")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-fade-in">
      <div className="w-full max-w-md p-10 glass border-gold/20 rounded-[3rem] animate-scale-in gold-glow">
        <div className="text-center mb-8">
          <div className="w-16 h-[2px] bg-gold mx-auto mb-6" />
          <h2 className="text-2xl font-black tracking-tighter text-white italic">ADMIN ACCESS</h2>
          <p className="text-[10px] text-gold/40 uppercase tracking-[0.3em] mt-2 font-bold whitespace-nowrap">
            Enter your secret key to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-white/5 bg-black/60 px-6 py-4 text-center text-xl tracking-widest outline-none focus:border-gold transition-all text-white font-black"
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
            className="w-full rounded-2xl bg-gold py-4 font-black text-xs uppercase tracking-[0.3em] text-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-gold/20 disabled:opacity-50"
          >
            {loading ? "VERIFYING..." : "GRANT ACCESS"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsOpen(false)
            setError("")
            setPassword("")
          }}
          className="mt-8 w-full text-[10px] font-black tracking-[0.4em] text-white/20 hover:text-white/40 uppercase transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
