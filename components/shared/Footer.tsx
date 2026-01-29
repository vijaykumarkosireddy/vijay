"use client"

import Link from "next/link"
import { SITE_CONTENT } from "@/constants/content"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-black py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <h3 className="text-2xl font-black tracking-tighter text-gold italic">
              {SITE_CONTENT.NAME}
            </h3>
            <p className="text-sm leading-relaxed text-foreground/50 font-light">
              Dedicated to preserving the soul of traditional arts through music and fine sketches.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
              Mastery
            </h4>
            <ul className="space-y-4 text-sm text-foreground/50 font-medium">
              <li>
                <Link href="/music" className="hover:text-gold transition-colors">
                  Vocal Music
                </Link>
              </li>
              <li>
                <Link href="/arts" className="hover:text-gold transition-colors">
                  Pencil Art
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Inquiries
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-gold transition-colors">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
              The Institution
            </h4>
            <p className="text-sm text-foreground/50 leading-relaxed">
              {SITE_CONTENT.SCHOOL_NAME}
              <br />
              Jaggampeta, AP
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
              Socials
            </h4>
            <div className="flex gap-6">
              {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/40 hover:text-gold transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  Instagram
                </a>
              )}
              {process.env.NEXT_PUBLIC_YOUTUBE_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/40 hover:text-gold transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  YouTube
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6 relative">
          <span className="text-[10px] font-bold tracking-[0.2em] text-foreground/30 uppercase">
            © {new Date().getFullYear()} {SITE_CONTENT.NAME}
          </span>
          <div className="flex gap-8">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("trigger-admin-overlay"))}
              className="opacity-20 hover:opacity-60 transition-all duration-300 absolute right-4 bottom-4 p-3 cursor-pointer rounded-full bg-primary/5 border border-gold/10 hover:bg-primary/10 hover:border-gold/30 hover:scale-110"
              title="Admin Access"
              aria-label="Admin Access"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gold/60"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
