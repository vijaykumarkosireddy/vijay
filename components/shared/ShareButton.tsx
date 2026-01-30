"use client"

import { useState } from "react"
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

  const handleShare = async () => {
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, "_blank", "noopener,noreferrer")
    setIsOpen(false)
  }

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={handleShare}
        className={cn(
          "inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-primary/20 hover:text-primary",
          className
        )}
        aria-label="Share"
      >
        <Share2 className="h-5 w-5" />
      </button>

      {/* Fallback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">Share to</h3>
            <p className="text-sm text-zinc-400 mb-6">{title}</p>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={shareToTwitter}
                className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <Twitter className="h-6 w-6 text-[#1DA1F2]" />
                <span className="text-xs font-medium text-zinc-300">Twitter</span>
              </button>

              <button
                onClick={shareToWhatsApp}
                className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366]">
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-zinc-300">WhatsApp</span>
              </button>

              <button
                onClick={copyToClipboard}
                className="flex flex-col items-center gap-2 rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10"
              >
                <div className={cn("rounded-full p-1", copied ? "bg-green-500/20 text-green-500" : "text-zinc-400")}>
                  {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                </div>
                <span className="text-xs font-medium text-zinc-300">
                  {copied ? "Copied" : "Copy Link"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
