"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"
import { useState } from "react"

interface ArtLightboxProps {
  images: Array<{ imageUrl: string; title: string; _id: any }>
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function ArtLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ArtLightboxProps) {
  const [zoomLevel, setZoomLevel] = useState(1)

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, onClose])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const goToPrevious = () => {
    setZoomLevel(1)
    onNavigate((currentIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setZoomLevel(1)
    onNavigate((currentIndex + 1) % images.length)
  }

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3))
  }

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1))
  }

  const currentImage = images[currentIndex]

  return (
    <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-xl flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 h-12 w-12 rounded-full glass border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
        aria-label="Close lightbox"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-50 h-14 w-14 rounded-full glass border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-50 h-14 w-14 rounded-full glass border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={zoomOut}
          disabled={zoomLevel <= 1}
          className="h-12 w-12 rounded-full glass border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-white/60">{Math.round(zoomLevel * 100)}%</span>
        <button
          onClick={zoomIn}
          disabled={zoomLevel >= 3}
          className="h-12 w-12 rounded-full glass border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative w-full h-full flex items-center justify-center p-20 overflow-auto">
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center",
          }}
        >
          <div className="relative w-[80vw] h-[80vh] max-w-6xl">
            <Image
              src={currentImage.imageUrl}
              alt={currentImage.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Image Info */}
      <div className="absolute bottom-6 left-6 z-50 glass p-6 rounded-2xl border-white/10 max-w-md">
        <h3 className="text-xl font-black text-gold mb-2">{currentImage.title}</h3>
        <p className="text-sm text-white/40 font-bold uppercase tracking-widest">
          {currentIndex + 1} / {images.length}
        </p>
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} aria-label="Close lightbox" />
    </div>
  )
}
