"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Menu, X } from "lucide-react"
import { ROUTES } from "@/constants/navigation"
import { SITE_CONTENT } from "@/constants/content"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function Navbar() {
  const pathname = usePathname()

  const closeMobileMenu = () => {
    const checkbox = document.getElementById("mobile-menu-toggle") as HTMLInputElement
    if (checkbox) {
      checkbox.checked = false
    }
  }

  return (
    <>
      <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />

      <nav className="fixed top-0 z-50 w-full bg-black/95 backdrop-blur-md border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12">
          <Link
            href="/"
            className="group flex items-center gap-3 relative z-50"
            onClick={e => {
              if (e.detail === 3) {
                window.dispatchEvent(new CustomEvent("trigger-admin-overlay"))
              }
              closeMobileMenu()
            }}
          >
            <div className="h-8 w-[2px] bg-primary transition-all group-hover:h-10" />
            <span className="text-xl font-bold tracking-tighter text-gold">
              {SITE_CONTENT.NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden gap-10 md:flex">
            {ROUTES.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-[13px] font-bold uppercase tracking-[0.2em] transition-all hover:text-primary",
                  pathname === item.path ? "text-primary" : "text-foreground/50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <a
              href="mailto:vijaykkosireddy@gmail.com"
              className="hidden text-[11px] font-black uppercase tracking-widest text-gold border-b border-accent/30 pb-1 hover:border-accent transition-all lg:block"
            >
              Inquiry
            </a>

            {/* Mobile Menu Toggle */}
            <label
              htmlFor="mobile-menu-toggle"
              className="relative z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/5 border border-primary/20 md:hidden"
              aria-label="Toggle Menu"
            >
              <Menu className="h-5 w-5 text-gold absolute peer-checked:opacity-0 opacity-100 transition-opacity" />
              <X className="h-5 w-5 text-gold absolute peer-checked:opacity-100 opacity-0 transition-opacity" />
            </label>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-500 md:hidden opacity-0 pointer-events-none translate-y-4 peer-checked:opacity-100 peer-checked:pointer-events-auto peer-checked:translate-y-0">
        <div className="flex flex-col items-center gap-8 text-center">
          {ROUTES.map(item => (
            <Link
              key={item.path}
              href={item.path}
              onClick={closeMobileMenu}
              className={cn(
                "text-2xl font-black uppercase tracking-[0.3em] transition-all cursor-pointer",
                pathname === item.path ? "text-primary" : "text-white/40"
              )}
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-8 h-[1px] w-48 bg-primary/30" />

          <a
            href="mailto:vijaykkosireddy@gmail.com"
            className="text-[11px] font-black uppercase tracking-widest text-gold mt-4"
            onClick={closeMobileMenu}
          >
            Inquiry
          </a>
        </div>
      </div>
    </>
  )
}
