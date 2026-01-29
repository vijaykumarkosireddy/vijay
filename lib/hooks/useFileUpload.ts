import { useState, useCallback } from "react"
import { API_ENDPOINTS, HTTP_METHODS } from "@/lib/constants/api-endpoints"

interface UploadResponse {
  url: string
  success: boolean
  error?: string
}

interface BulkUploadResponse {
  success: boolean
  uploadedCount: number
  error?: string
}

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const uploadFile = useCallback(async (file: File): Promise<UploadResponse> => {
    setIsUploading(true)
    setError(null)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(API_ENDPOINTS.UPLOAD, {
        method: HTTP_METHODS.POST,
        body: formData,
      })

      setProgress(50)

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      setProgress(100)

      return { url: result.url, success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown upload error"
      setError(errorMessage)
      return { url: "", success: false, error: errorMessage }
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }, [])

  const uploadMultipleFiles = useCallback(
    async (
      files: FileList,
      titleBase: string,
      onProgress?: (current: number, total: number) => void
    ): Promise<BulkUploadResponse> => {
      setIsUploading(true)
      setError(null)

      try {
        let uploadedCount = 0

        for (let i = 0; i < files.length; i++) {
          const file = files[i]

          // Upload file
          const uploadResult = await uploadFile(file)
          if (!uploadResult.success) {
            throw new Error(`Failed to upload file ${i + 1}: ${uploadResult.error}`)
          }

          // Create art entry
          const title = `${titleBase} ${files.length > 1 ? i + 1 : ""}`.trim()
          const artResponse = await fetch(API_ENDPOINTS.ARTS, {
            method: HTTP_METHODS.POST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              imageUrl: uploadResult.url,
            }),
          })

          if (!artResponse.ok) {
            throw new Error(`Failed to create art entry for file ${i + 1}`)
          }

          uploadedCount++
          onProgress?.(uploadedCount, files.length)
        }

        return { success: true, uploadedCount }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Bulk upload failed"
        setError(errorMessage)
        return { success: false, uploadedCount: 0, error: errorMessage }
      } finally {
        setIsUploading(false)
      }
    },
    [uploadFile]
  )

  const uploadTestimonialWithImage = useCallback(
    async (
      testimonialData: any,
      imageFile?: File
    ): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
      setIsUploading(true)
      setError(null)

      try {
        let imageUrl = testimonialData._id ? testimonialData.existingImageUrl || "" : ""

        // Upload image if provided
        if (imageFile) {
          const uploadResult = await uploadFile(imageFile)
          if (!uploadResult.success) {
            throw new Error(`Image upload failed: ${uploadResult.error}`)
          }
          imageUrl = uploadResult.url
        }

        return { success: true, imageUrl }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Testimonial upload failed"
        setError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsUploading(false)
      }
    },
    [uploadFile]
  )

  return {
    uploadFile,
    uploadMultipleFiles,
    uploadTestimonialWithImage,
    isUploading,
    progress,
    error,
    clearError: () => setError(null),
  }
}
