"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { Share2, X, Link as LinkIcon, Twitter, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareButtonProps {
  title: string
  text: string
  url: string
  className?: string
}

export default function ShareButton({ title, text, url, className }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const getShareUrl = () => {
    if (url) return url
    if (typeof window !== "undefined") return window.location.href
    return ""
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const shareUrl = getShareUrl()
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      setIsOpen(true)
    }
  }

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const shareUrl = getShareUrl()
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const shareToTwitter = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const shareUrl = getShareUrl()
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, "_blank", "noopener,noreferrer")
    setIsOpen(false)
  }

  const shareToLinkedIn = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const shareUrl = getShareUrl()
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(linkedInUrl, "_blank", "noopener,noreferrer")
    setIsOpen(false)
  }

  const shareToInstagram = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const shareUrl = getShareUrl()
    navigator.clipboard.writeText(shareUrl)
    alert("Link copied! You can now share it on Instagram.")
    setIsOpen(false)
  }

  const shareToWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const shareUrl = getShareUrl()
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={handleShare}
        className={cn(
          "inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-primary/20 hover:text-primary cursor-pointer",
          className
        )}
        aria-label="Share"
      >
        <Share2 className="h-5 w-5" />
      </button>

      {/* Fallback Modal - rendered via portal to escape parent hover containers */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={e => {
              e.stopPropagation()
              setIsOpen(false)
            }}
          >
            <div
              className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={e => {
                  e.stopPropagation()
                  setIsOpen(false)
                }}
                className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-2">Share</h3>
              <p className="text-sm text-zinc-400 mb-6">{title}</p>

              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={shareToTwitter}
                    className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10 cursor-pointer"
                  >
                    <Twitter className="h-6 w-6 text-[#1DA1F2]" />
                    <span className="text-xs font-medium text-zinc-300">Twitter</span>
                  </button>

                  <button
                    onClick={shareToLinkedIn}
                    className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10 cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" fill="#0A66C2" className="h-6 w-6">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="text-xs font-medium text-zinc-300">LinkedIn</span>
                  </button>

                  <button
                    onClick={shareToWhatsApp}
                    className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366]">
                      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-zinc-300">WhatsApp</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={shareToInstagram}
                    className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10 cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" fill="url(#instagram-gradient)" className="h-6 w-6">
                      <defs>
                        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FD5949" />
                          <stop offset="50%" stopColor="#D6249F" />
                          <stop offset="100%" stopColor="#285AEB" />
                        </linearGradient>
                      </defs>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="text-xs font-medium text-zinc-300">Instagram</span>
                  </button>

                  <button
                    onClick={copyToClipboard}
                    className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10 cursor-pointer"
                  >
                    <div
                      className={cn(
                        "rounded-full p-1",
                        copied ? "bg-green-500/20 text-green-500" : "text-zinc-400"
                      )}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                    </div>
                    <span className="text-xs font-medium text-zinc-300">
                      {copied ? "Copied" : "Copy Link"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
