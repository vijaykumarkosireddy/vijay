"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: "danger" | "warning" | "info"
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "warning",
}: ConfirmDialogProps) {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onCancel()
        if (e.key === "Enter") onConfirm()
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onConfirm, onCancel])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const variantStyles = {
    danger: "border-red-500/20 bg-red-500/5",
    warning: "border-yellow-500/20 bg-yellow-500/5",
    info: "border-blue-500/20 bg-blue-500/5",
  }

  const confirmButtonStyles = {
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-black",
    info: "bg-blue-500 hover:bg-blue-600 text-white",
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-md mx-4 glass p-8 rounded-3xl border ${variantStyles[variant]} animate-in zoom-in-95 duration-200`}
      >
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tighter italic text-white">{title}</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">{message}</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl glass border-white/10 text-white/60 hover:text-white hover:border-white/20 font-bold text-sm uppercase tracking-widest transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${confirmButtonStyles[variant]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to cancel */}
      <div className="absolute inset-0 -z-10" onClick={onCancel} />
    </div>
  )
}
