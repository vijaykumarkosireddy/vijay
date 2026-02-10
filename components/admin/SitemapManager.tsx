"use client"

import { useState } from "react"

interface SitemapManagerProps {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

export default function SitemapManager({ onSuccess, onError }: SitemapManagerProps) {
  const [isRevalidating, setIsRevalidating] = useState(false)
  const [lastRevalidated, setLastRevalidated] = useState<string | null>(null)

  const handleRevalidate = async () => {
    setIsRevalidating(true)
    try {
      const response = await fetch("/api/sitemap/revalidate", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setLastRevalidated(new Date().toLocaleString())
        onSuccess?.(data.message || "Sitemap regenerated successfully!")
      } else {
        onError?.(data.error || "Failed to regenerate sitemap")
      }
    } catch (error) {
      onError?.("Failed to regenerate sitemap")
    } finally {
      setIsRevalidating(false)
    }
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Sitemap Management</h3>
        <p className="mt-1 text-sm text-neutral-400">
          Regenerate the sitemap to include the latest content from your site.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleRevalidate}
          disabled={isRevalidating}
          className="rounded-lg px-4 py-2 text-sm font-mediumtransition-colors bg-primary text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRevalidating ? "Regenerating..." : "Regenerate Sitemap"}
        </button>

        {lastRevalidated && (
          <span className="text-sm text-neutral-400">
            Last regenerated: {lastRevalidated}
          </span>
        )}
      </div>

      <div className="mt-4 text-xs text-neutral-500">
        <p>
          The sitemap is automatically updated every hour. Use this button to force an immediate
          update after adding or modifying content.
        </p>
      </div>
    </div>
  )
}
