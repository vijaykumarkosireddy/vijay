import { useMemo } from "react"
import {
  API_ENDPOINTS,
  HTTP_METHODS,
  COLLECTIONS,
  ApiEndpointKey,
  CollectionKey,
} from "@/lib/constants/api-endpoints"

/**
 * Hook that provides easy access to API endpoints and utilities
 * This is a dedicated hook for managing API endpoints centrally
 */
export function useApiEndpoints() {
  // Memoize endpoint getters to prevent unnecessary recalculations
  const endpoints = useMemo(
    () => ({
      // Collection endpoints
      getMusic: () => API_ENDPOINTS.MUSIC,
      getArts: () => API_ENDPOINTS.ARTS,
      getTestimonials: () => API_ENDPOINTS.TESTIMONIALS,
      getBookings: () => API_ENDPOINTS.BOOKINGS,

      // Management endpoints
      getManage: () => API_ENDPOINTS.MANAGE,

      // File upload endpoint
      getUpload: () => API_ENDPOINTS.UPLOAD,

      // YouTube integration
      getYouTubeSync: () => API_ENDPOINTS.YOUTUBE_SYNC,

      // Auth endpoints
      getAuth: {
        login: () => API_ENDPOINTS.AUTH.LOGIN,
        logout: () => API_ENDPOINTS.AUTH.LOGOUT,
        verify: () => API_ENDPOINTS.AUTH.VERIFY,
      },
    }),
    []
  )

  // Memoize collection utilities
  const collections = useMemo(
    () => ({
      getCollectionName: (key: CollectionKey) => COLLECTIONS[key],
      getAllCollections: () => COLLECTIONS,
      validateCollection: (key: string): key is CollectionKey => key in COLLECTIONS,
    }),
    []
  )

  // Memoize HTTP methods
  const methods = useMemo(() => HTTP_METHODS, [])

  // Utility function to build manage endpoint with query params
  const buildManageUrl = useMemo(
    () => ({
      delete: (collection: CollectionKey, id: string) =>
        `${API_ENDPOINTS.MANAGE}?collection=${COLLECTIONS[collection]}&id=${id}`,
      toggleFavorite: () => API_ENDPOINTS.MANAGE,
    }),
    []
  )

  // Utility function to get endpoint by collection name
  const getEndpointByCollection = useMemo(
    () =>
      (collection: string): ApiEndpointKey | null => {
        const upperCollection = collection.toUpperCase()
        switch (upperCollection) {
          case "MUSIC":
            return "MUSIC"
          case "ARTS":
            return "ARTS"
          case "TESTIMONIALS":
            return "TESTIMONIALS"
          case "BOOKINGS":
            return "BOOKINGS"
          case "MANAGE":
            return "MANAGE"
          case "UPLOAD":
            return "UPLOAD"
          case "YOUTUBE_SYNC":
            return "YOUTUBE_SYNC"
          default:
            return null
        }
      },
    []
  )

  return {
    endpoints,
    collections,
    methods,
    buildManageUrl,
    getEndpointByCollection,
    // Direct access to constants for backward compatibility
    API_ENDPOINTS,
    HTTP_METHODS,
    COLLECTIONS,
  }
}

/**
 * Type-safe endpoint selector hook
 * Returns a specific endpoint based on the key
 */
export function useEndpoint<T extends ApiEndpointKey>(endpointKey: T) {
  const { endpoints } = useApiEndpoints()

  return useMemo(() => {
    switch (endpointKey) {
      case "MUSIC":
        return endpoints.getMusic()
      case "ARTS":
        return endpoints.getArts()
      case "TESTIMONIALS":
        return endpoints.getTestimonials()
      case "BOOKINGS":
        return endpoints.getBookings()
      case "MANAGE":
        return endpoints.getManage()
      case "UPLOAD":
        return endpoints.getUpload()
      case "YOUTUBE_SYNC":
        return endpoints.getYouTubeSync()
      default:
        const _exhaustiveCheck: never = endpointKey
        throw new Error(`Unknown endpoint key: ${_exhaustiveCheck}`)
    }
  }, [endpoints, endpointKey])
}
