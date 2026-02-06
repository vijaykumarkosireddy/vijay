import { useState, useEffect, useCallback } from "react"
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints"

interface FetchResponse<T = any> {
  data: T[]
  isLoading: boolean
  error: string | null
  refetch: (specificCollection?: string) => Promise<void>
}

export function useDataFetch(
  initialCollections: string[] = ["music", "arts", "blogs", "testimonials", "bookings"]
): {
  music: FetchResponse
  arts: FetchResponse
  blogs: FetchResponse
  testimonials: FetchResponse
  bookings: FetchResponse
  fetchItems: (specificCollection?: string) => Promise<void>
  isLoading: boolean
  error: string | null
} {
  const [music, setMusic] = useState<any[]>([])
  const [arts, setArts] = useState<any[]>([])
  const [blogs, setBlogs] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async (specificCollection?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      if (specificCollection) {
        // Fetch only the specific collection
        const endpoint =
          API_ENDPOINTS[specificCollection.toUpperCase() as keyof typeof API_ENDPOINTS]
        if (typeof endpoint !== "string") {
          throw new Error(`Invalid collection: ${specificCollection}`)
        }

        const response = await fetch(endpoint, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch ${specificCollection}: ${response.statusText}`)
        }

        const data = await response.json()

        switch (specificCollection) {
          case "music":
            setMusic(data)
            break
          case "arts":
            setArts(data)
            break
          case "blogs":
            setBlogs(data)
            break
          case "testimonials":
            setTestimonials(data)
            break
          case "bookings":
            setBookings(data)
            break
        }
      } else {
        // Fetch all collections (initial load)
        const [musicRes, artRes, blogRes, testRes, bookRes] = await Promise.all([
          fetch(API_ENDPOINTS.MUSIC, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          }),
          fetch(API_ENDPOINTS.ARTS, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          }),
          fetch(API_ENDPOINTS.BLOGS, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          }),
          fetch(API_ENDPOINTS.TESTIMONIALS, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          }),
          fetch(API_ENDPOINTS.BOOKINGS, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          }),
        ])

        if (musicRes.ok) setMusic(await musicRes.json())
        if (artRes.ok) setArts(await artRes.json())
        if (blogRes.ok) setBlogs(await blogRes.json())
        if (testRes.ok) setTestimonials(await testRes.json())
        if (bookRes.ok) setBookings(await bookRes.json())
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const createCollectionResponse = useCallback(
    (data: any[], collectionName: string): FetchResponse => ({
      data,
      isLoading,
      error,
      refetch: () => fetchItems(collectionName),
    }),
    [isLoading, error, fetchItems]
  )

  return {
    music: createCollectionResponse(music, "music"),
    arts: createCollectionResponse(arts, "arts"),
    blogs: createCollectionResponse(blogs, "blogs"),
    testimonials: createCollectionResponse(testimonials, "testimonials"),
    bookings: createCollectionResponse(bookings, "bookings"),
    fetchItems,
    isLoading,
    error,
  }
}

// Individual collection hook for more specific use cases
export function useCollectionData(collectionName: string) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const endpointKey = collectionName.toUpperCase() as keyof typeof API_ENDPOINTS
      const endpoint = API_ENDPOINTS[endpointKey]

      if (typeof endpoint !== "string") {
        throw new Error(`Invalid collection: ${collectionName}`)
      }

      const response = await fetch(endpoint, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${collectionName}: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data"
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [collectionName])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}
