// Blog API Service - Centralized API calls for blog CRUD operations

export interface BlogFormData {
  title: string
  excerpt: string
  content: string
  tags: string[]
  image: string | null
  published: boolean
  isDraft: boolean
  isFavorite?: boolean
  _id?: string
  slug?: string
  createdAt?: string
  updatedAt?: string
}

export const blogApi = {
  async fetchBlogs(filters?: { published?: boolean; isDraft?: boolean; tag?: string }) {
    const params = new URLSearchParams()
    if (filters?.published !== undefined) params.set("published", filters.published.toString())
    if (filters?.isDraft !== undefined) params.set("isDraft", filters.isDraft.toString())
    if (filters?.tag) params.set("tag", filters.tag)

    const response = await fetch(`/api/blogs?${params.toString()}`)
    if (!response.ok) throw new Error("Failed to fetch blogs")
    return response.json()
  },

  async fetchBlog(id: string) {
    const response = await fetch(`/api/blogs/${id}`)
    if (!response.ok) throw new Error("Failed to fetch blog")
    return response.json()
  },

  async fetchBlogBySlug(slug: string) {
    const response = await fetch(`/api/blogs/slug/${slug}`)
    if (!response.ok) throw new Error("Failed to fetch blog")
    return response.json()
  },

  async createBlog(data: Omit<BlogFormData, "_id">) {
    const response = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create blog")
    return response.json()
  },

  async updateBlog(id: string, data: Partial<BlogFormData>) {
    const response = await fetch(`/api/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update blog")
    return response.json()
  },

  async deleteBlog(id: string) {
    const response = await fetch(`/api/blogs/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete blog")
    return response.json()
  },

  async toggleBlogPublished(id: string, value: boolean) {
    const response = await fetch(`/api/blogs/${id}?action=togglePublished&value=${value}`, {
      method: "PATCH",
    })
    if (!response.ok) throw new Error("Failed to toggle published status")
    return response.json()
  },

  async toggleBlogFavorite(id: string, value: boolean) {
    const response = await fetch(`/api/blogs/${id}?action=toggleFavorite&value=${value}`, {
      method: "PATCH",
    })
    if (!response.ok) throw new Error("Failed to toggle favorite status")
    return response.json()
  },
}
