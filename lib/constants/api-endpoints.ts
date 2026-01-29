export const API_ENDPOINTS = {
  MUSIC: "/api/music" as const,
  ARTS: "/api/arts" as const,
  TESTIMONIALS: "/api/testimonials" as const,
  BOOKINGS: "/api/bookings" as const,

  MANAGE: "/api/manage" as const,

  UPLOAD: "/api/upload" as const,

  YOUTUBE_SYNC: "/api/youtube/sync" as const,

  AUTH: {
    LOGIN: "/api/auth/login" as const,
    LOGOUT: "/api/auth/logout" as const,
    VERIFY: "/api/auth/verify" as const,
  },
} as const

export type ApiEndpointKey = keyof Omit<typeof API_ENDPOINTS, "AUTH">

export const HTTP_METHODS = {
  GET: "GET" as const,
  POST: "POST" as const,
  PUT: "PUT" as const,
  PATCH: "PATCH" as const,
  DELETE: "DELETE" as const,
} as const

export const COLLECTIONS = {
  MUSIC: "MUSIC" as const,
  ARTS: "ARTS" as const,
  TESTIMONIALS: "TESTIMONIALS" as const,
  BOOKINGS: "BOOKINGS" as const,
} as const

export type CollectionKey = keyof typeof COLLECTIONS

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
} as const
