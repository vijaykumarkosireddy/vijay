import { useState, useCallback } from "react"
import {
  API_ENDPOINTS,
  HTTP_METHODS,
  COLLECTIONS,
  ApiResponse,
  DEFAULT_HEADERS,
  ApiEndpointKey,
  CollectionKey,
} from "@/lib/constants/api-endpoints"

interface CrudResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export function useCrudOperations() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = useCallback(
    async <T>(endpoint: ApiEndpointKey, data: T): Promise<ApiResponse<T>> => {
      setIsLoading(true)
      setError(null)

      try {
        const endpointUrl = API_ENDPOINTS[endpoint]
        const response = await fetch(endpointUrl, {
          method: HTTP_METHODS.POST,
          headers: DEFAULT_HEADERS,
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error(`Failed to create: ${response.statusText}`)
        }

        const result = await response.json()
        return { success: true, data: result }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const update = useCallback(
    async <T>(endpoint: ApiEndpointKey, id: string, data: T): Promise<ApiResponse<T>> => {
      setIsLoading(true)
      setError(null)

      try {
        const endpointUrl = API_ENDPOINTS[endpoint]
        const response = await fetch(endpointUrl, {
          method: HTTP_METHODS.PATCH,
          headers: DEFAULT_HEADERS,
          body: JSON.stringify({ id, data }),
        })

        if (!response.ok) {
          throw new Error(`Failed to update: ${response.statusText}`)
        }

        const result = await response.json()
        return { success: true, data: result }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const deleteItem = useCallback(
    async (collection: CollectionKey, id: string): Promise<ApiResponse> => {
      setIsLoading(true)
      setError(null)

      try {
        const collectionName = COLLECTIONS[collection]
        const response = await fetch(
          `${API_ENDPOINTS.MANAGE}?collection=${collectionName}&id=${id}`,
          {
            method: HTTP_METHODS.DELETE,
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to delete: ${response.statusText}`)
        }

        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const toggleFavorite = useCallback(
    async (collection: CollectionKey, id: string, currentStatus: boolean): Promise<ApiResponse> => {
      setIsLoading(true)
      setError(null)

      try {
        const collectionName = COLLECTIONS[collection]
        const response = await fetch(API_ENDPOINTS.MANAGE, {
          method: HTTP_METHODS.PATCH,
          headers: DEFAULT_HEADERS,
          body: JSON.stringify({ collection: collectionName, id, status: !currentStatus }),
        })

        if (!response.ok) {
          throw new Error(`Failed to toggle favorite: ${response.statusText}`)
        }

        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    create,
    update,
    deleteItem,
    toggleFavorite,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
