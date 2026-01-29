import { useState, useCallback } from "react"
import { API_ENDPOINTS, HTTP_METHODS, ApiResponse } from "@/lib/constants/api-endpoints"

interface SyncResponse {
  success: boolean
  added?: number
  error?: string
}

export function useYouTubeSync() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const syncYouTube = useCallback(async (): Promise<ApiResponse & { added?: number }> => {
    setIsSyncing(true)
    setError(null)

    try {
      const response = await fetch(API_ENDPOINTS.YOUTUBE_SYNC, { method: HTTP_METHODS.POST })

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "YouTube sync failed")
      }

      return {
        success: true,
        added: data.added || 0,
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "YouTube sync failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsSyncing(false)
    }
  }, [])

  return {
    syncYouTube,
    isSyncing,
    error,
    clearError: () => setError(null),
  }
}
