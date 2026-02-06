"use client"

import { useState } from "react"
import { blogApi, BlogFormData } from "@/lib/services/blogApi"

export function useBlogOperations() {
  const [isLoading, setIsLoading] = useState(false)

  const createBlog = async (data: Omit<BlogFormData, "_id">) => {
    setIsLoading(true)
    try {
      const result = await blogApi.createBlog(data)
      return { success: true, id: result.id, error: null }
    } catch (error) {
      return { success: false, id: null, error: (error as Error).message }
    } finally {
      setIsLoading(false)
    }
  }

  const updateBlog = async (id: string, data: Partial<BlogFormData>) => {
    setIsLoading(true)
    try {
      await blogApi.updateBlog(id, data)
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    } finally {
      setIsLoading(false)
    }
  }

  const deleteBlog = async (id: string) => {
    setIsLoading(true)
    try {
      await blogApi.deleteBlog(id)
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    } finally {
      setIsLoading(false)
    }
  }

  const togglePublished = async (id: string, value: boolean) => {
    setIsLoading(true)
    try {
      await blogApi.toggleBlogPublished(id, value)
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = async (id: string, value: boolean) => {
    setIsLoading(true)
    try {
      await blogApi.toggleBlogFavorite(id, value)
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createBlog,
    updateBlog,
    deleteBlog,
    togglePublished,
    toggleFavorite,
    isLoading,
  }
}
