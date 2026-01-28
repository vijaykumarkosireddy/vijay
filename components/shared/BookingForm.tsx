"use client"

import { useState } from "react"

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "Vocal Music",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      })
      if (res.ok) {
        setStatus("success")
        setFormData({ name: "", email: "", phone: "", interest: "Vocal Music", message: "" })
      } else {
        setStatus("error")
      }
    } catch (error) {
      setStatus("error")
    }
  }

  return (
    <div className="glass p-8 md:p-12 rounded-[2.5rem] border-primary/10 gold-glow overflow-hidden relative">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 opacity-[0.03] text-8xl font-black italic gold-glow pointer-events-none">
        BOOK
      </div>

      <div className="relative z-10 space-y-8">
        <div className="space-y-2">
          <h3 className="text-3xl font-black tracking-tighter italic text-gold uppercase">
            Get In Touch
          </h3>
          <p className="text-sm text-foreground/50 font-light">
            Music Training • Art Commissions • Consultations
          </p>
        </div>

        {status === "success" ? (
          <div className="py-12 text-center space-y-4 animate-scale-in">
            <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <p className="font-bold text-gold uppercase tracking-widest text-xs">
              Request Sent Successfully
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="text-xs underline opacity-40 hover:opacity-100"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <input
                type="text"
                placeholder="Name"
                className="w-full rounded-2xl border border-border bg-black/40 px-6 py-4 outline-none focus:border-gold transition-all"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-2xl border border-border bg-black/40 px-6 py-4 outline-none focus:border-gold transition-all"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <input
                type="tel"
                placeholder="Phone"
                className="w-full rounded-2xl border border-border bg-black/40 px-6 py-4 outline-none focus:border-gold transition-all"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <select
                className="w-full rounded-2xl border border-border bg-black/40 px-6 py-4 text-white outline-none focus:border-gold transition-all font-medium appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d4af37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "20px",
                }}
                value={formData.interest}
                onChange={e => setFormData({ ...formData, interest: e.target.value })}
              >
                <option value="Vocal Music" className="bg-black text-white">
                  Vocal Music
                </option>
                <option value="Pencil Sketching" className="bg-black text-white">
                  Pencil Sketching
                </option>
                <option value="Art Commission" className="bg-black text-white">
                  Art Commission
                </option>
                <option value="General Inquiry" className="bg-black text-white">
                  General Inquiry
                </option>
              </select>
            </div>
            <textarea
              rows={3}
              placeholder="Tell me about your goals..."
              className="w-full rounded-2xl border border-border bg-black/40 px-6 py-4 outline-none focus:border-gold transition-all resize-none"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-2xl bg-primary text-black py-5 font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "SENDING..." : "SEND INQUIRY"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
