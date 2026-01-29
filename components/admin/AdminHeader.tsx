"use client"

import { SITE_CONTENT } from "@/constants/content"

interface AdminHeaderProps {
  onLogout: () => void
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-16">
      <div>
        <h1 className="text-4xl font-black tracking-tighter text-gold italic">DASHBOARD</h1>
        <p className="text-sm text-foreground/30 mt-1 uppercase tracking-widest">
          {SITE_CONTENT.NAME} • MASTER CONTROL
        </p>
      </div>
      <button
        onClick={onLogout}
        className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-xs uppercase tracking-widest hover:bg-red-500 transition-all hover:text-white hover:border-red-500"
      >
        Terminate Session
      </button>
    </div>
  )
}
