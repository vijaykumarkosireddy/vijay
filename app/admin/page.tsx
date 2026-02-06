"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { ToastContainer, ToastProps } from "@/components/shared/Toast"
import { getCookie, deleteCookie } from "@/lib/cookies"
import { useCrudOperations } from "@/lib/hooks/useCrudOperations"
import { useDataFetch } from "@/lib/hooks/useDataFetch"
import { useFileUpload } from "@/lib/hooks/useFileUpload"
import { useYouTubeSync } from "@/lib/hooks/useYouTubeSync"
import { useBlogOperations } from "@/lib/hooks/useBlogOperations"
import { BlogFormData } from "@/lib/services/blogApi"
import { API_ENDPOINTS, COLLECTIONS } from "@/lib/constants/api-endpoints"
import { AdminHeader, AdminTabs, FormsContainer, DatabaseExplorer } from "@/components/admin"
import PushNotificationManager from "@/components/shared/PushNotificationManager"
import BlogForm from "@/components/admin/blog/BlogForm"
import BlogPreview from "@/components/admin/blog/BlogPreview"
import BlogList from "@/components/admin/blog/BlogList"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("music")
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [isYouTubeSyncing, setIsYouTubeSyncing] = useState(false)
  const [toasts, setToasts] = useState<ToastProps[]>([])
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  })
  const router = useRouter()

  // Custom hooks
  const {
    create,
    update,
    deleteItem,
    toggleFavorite,
    isLoading: isCrudLoading,
  } = useCrudOperations()
  const {
    music,
    arts,
    blogs,
    testimonials,
    bookings,
    fetchItems,
    isLoading: isDataLoading,
  } = useDataFetch()
  const { uploadMultipleFiles, uploadTestimonialWithImage, isUploading } = useFileUpload()
  const { syncYouTube, isSyncing: isYouTubeSyncingHook } = useYouTubeSync()

  // Form States
  const [musicForm, setMusicForm] = useState({
    title: "",
    url: "",
    platform: "YouTube",
    _id: null as string | null,
  })

  const [artFile, setArtFile] = useState<File | null>(null)
  const [artForm, setArtForm] = useState({
    title: "",
    imageUrl: "",
    _id: null as string | null,
  })

  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "",
    text: "",
    file: null as File | null,
    _id: null as string | null,
  })

  const [blogForm, setBlogForm] = useState<BlogFormData>({
    title: "",
    excerpt: "",
    content: "",
    tags: [],
    image: null,
    published: false,
    isDraft: true,
    isFavorite: false,
    _id: undefined,
  })
  const [blogPreviewMode, setBlogPreviewMode] = useState(false)

  // Blog operations hook
  const blogOps = useBlogOperations()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify")
        const data = await response.json()

        if (data.authenticated) {
          setIsAuthenticated(true)
        } else {
          router.push("/")
        }
      } catch (error) {
        router.push("/")
      }
    }

    verifyAuth()
  }, [router])

  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, message, onClose: () => removeToast(id) }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const handleLogout = () => {
    deleteCookie("admin_auth")
    deleteCookie("admin_login_time")
    router.push("/")
  }

  const handleToggleFavorite = async (collection: string, id: string, currentStatus: boolean) => {
    const collectionKey = collection.toUpperCase() as keyof typeof COLLECTIONS
    const result = await toggleFavorite(collectionKey, id, currentStatus)
    if (result.success) {
      fetchItems(collection)
      addToast("success", currentStatus ? "Removed from favorites" : "Added to favorites")
    } else {
      addToast("error", result.error || "Failed to update favorite status")
    }
  }

  const handleDelete = (collection: string, id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Item",
      message: "Are you sure you want to delete this item? This action cannot be undone.",
      onConfirm: async () => {
        const collectionKey = collection.toUpperCase() as keyof typeof COLLECTIONS
        const result = await deleteItem(collectionKey, id)
        if (result.success) {
          fetchItems(collection)
          addToast("success", "Item deleted successfully")
        } else {
          addToast("error", result.error || "Failed to delete item")
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false })
      },
    })
  }

  const handleSyncYouTube = async () => {
    const result = await syncYouTube()
    if (result.success) {
      addToast("success", `Added ${result.added} new videos`)
    } else {
      addToast("error", `Sync failed: ${result.error}`)
    }
    fetchItems("music")
  }

  const handleMusicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let result
    if (musicForm._id) {
      result = await update("MUSIC", musicForm._id, musicForm)
    } else {
      result = await create("MUSIC", musicForm)
    }

    if (result.success) {
      setMusicForm({ title: "", url: "", platform: "YouTube", _id: null })
      fetchItems("music")
      addToast("success", musicForm._id ? "Music updated" : "Music added")
    } else {
      addToast("error", result.error || "Failed to save music")
    }
  }

  const handleArtSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let imageUrl = artForm.imageUrl

    // Upload file if provided (for new entries or when updating with new image)
    if (artFile) {
      const formData = new FormData()
      formData.append("file", artFile)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Failed to upload image")
        }

        const result = await response.json()
        imageUrl = result.url
      } catch (error) {
        addToast("error", "Failed to upload image")
        return
      }
    }

    // For new entries, imageUrl is required
    if (!artForm._id && !imageUrl) {
      addToast("error", "Please select an image file")
      return
    }

    const artData = {
      title: artForm.title,
      imageUrl: imageUrl,
    }

    let result
    if (artForm._id) {
      result = await update("ARTS", artForm._id, artData)
    } else {
      result = await create("ARTS", artData)
    }

    if (result.success) {
      setArtForm({ title: "", imageUrl: "", _id: null })
      setArtFile(null)
      fetchItems("arts")
      addToast("success", artForm._id ? "Art updated" : "Art added")
    } else {
      addToast("error", result.error || "Failed to save art")
    }
  }

  // Legacy handler - kept for compatibility but no longer used
  const handleArtBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    addToast("info", "Batch upload has been removed. Please use individual upload.")
  }

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const uploadResult = await uploadTestimonialWithImage(
      testimonialForm,
      testimonialForm.file || undefined
    )

    if (!uploadResult.success) {
      addToast("error", uploadResult.error || "Failed to upload testimonial")
      return
    }

    const testimonialData = {
      ...testimonialForm,
      imageUrl: uploadResult.imageUrl,
      file: undefined,
    }

    let result
    if (testimonialForm._id) {
      result = await update("TESTIMONIALS", testimonialForm._id, testimonialData)
    } else {
      result = await create("TESTIMONIALS", testimonialData)
    }

    if (result.success) {
      setTestimonialForm({ name: "", role: "", text: "", file: null, _id: null })
      fetchItems("testimonials")
      addToast("success", testimonialForm._id ? "Testimonial updated" : "Testimonial added")
    } else {
      addToast("error", result.error || "Failed to save testimonial")
    }
  }

  // Blog-specific handlers
  const handleBlogPreview = () => {
    setBlogPreviewMode(true)
  }

  const handleBlogSaveDraft = async () => {
    const data = { ...blogForm, isDraft: true, published: false }
    const result = blogForm._id
      ? await blogOps.updateBlog(blogForm._id, data)
      : await blogOps.createBlog(data)

    if (result.success) {
      resetBlogForm()
      setBlogPreviewMode(false)
      fetchItems("blogs")
      addToast("success", "Blog saved as draft successfully!")
    } else {
      addToast("error", result.error || "Failed to save draft")
    }
  }

  const handleBlogPublish = async () => {
    const data = { ...blogForm, isDraft: false, published: true }
    const result = blogForm._id
      ? await blogOps.updateBlog(blogForm._id, data)
      : await blogOps.createBlog(data)

    if (result.success) {
      resetBlogForm()
      setBlogPreviewMode(false)
      fetchItems("blogs")
      addToast("success", "Blog published successfully! 🎉")
    } else {
      addToast("error", result.error || "Failed to publish blog")
    }
  }

  const handleToggleBlogPublished = async (id: string, currentStatus: boolean) => {
    const result = await blogOps.togglePublished(id, !currentStatus)
    if (result.success) {
      fetchItems("blogs")
      addToast("success", currentStatus ? "Blog unpublished" : "Blog published")
    } else {
      addToast("error", result.error || "Failed to toggle published status")
    }
  }

  const handleToggleBlogFavorite = async (id: string, currentStatus: boolean) => {
    const result = await blogOps.toggleFavorite(id, !currentStatus)
    if (result.success) {
      fetchItems("blogs")
      addToast("success", currentStatus ? "Removed from favorites" : "Added to favorites")
    } else {
      addToast("error", result.error || "Failed to toggle favorite")
    }
  }

  const handleBlogDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Blog Post",
      message: "Are you sure you want to delete this blog post? This action cannot be undone.",
      onConfirm: async () => {
        const result = await blogOps.deleteBlog(id)
        if (result.success) {
          fetchItems("blogs")
          addToast("success", "Blog deleted successfully")
        } else {
          addToast("error", result.error || "Failed to delete blog")
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false })
      },
    })
  }

  const resetBlogForm = () => {
    setBlogForm({
      title: "",
      excerpt: "",
      content: "",
      tags: [],
      image: null,
      published: false,
      isDraft: true,
      isFavorite: false,
      _id: undefined,
    })
  }

  const handleEdit = (item: any) => {
    if (activeTab === "music") {
      setMusicForm({ ...item })
    } else if (activeTab === "arts") {
      setArtForm({ ...item })
    } else if (activeTab === "blogs") {
      setBlogForm({ ...item })
      setBlogPreviewMode(false)
    } else if (activeTab === "testimonials") {
      setTestimonialForm({ ...item, file: null })
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 pb-32 animate-reveal">
      <AdminHeader onLogout={handleLogout} />

      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Push Notification Manager */}
      <div className="mb-8">
        <PushNotificationManager />
      </div>

      <div className="space-y-12">
        <div className="space-y-12">
          {activeTab === "blogs" ? (
            blogPreviewMode ? (
              <BlogPreview
                blog={blogForm}
                onBack={() => setBlogPreviewMode(false)}
                onSaveDraft={handleBlogSaveDraft}
                onPublish={handleBlogPublish}
                isSubmitting={blogOps.isLoading}
              />
            ) : (
              <div className="space-y-12">
                <BlogForm
                  form={blogForm}
                  onFormChange={setBlogForm}
                  onPreview={handleBlogPreview}
                  onSaveDraft={handleBlogSaveDraft}
                  isUploading={blogOps.isLoading}
                  mode={blogForm._id ? "edit" : "create"}
                />
                <BlogList
                  blogs={blogs.data}
                  onEdit={handleEdit}
                  onTogglePublished={handleToggleBlogPublished}
                  onToggleFavorite={handleToggleBlogFavorite}
                  onDelete={handleBlogDelete}
                />
              </div>
            )
          ) : (
            <>
              <FormsContainer
                activeTab={activeTab}
                musicForm={musicForm}
                artForm={artForm}
                artFiles={artFile}
                artTitleBase=""
                testimonialForm={testimonialForm}
                blogForm={blogForm as any}
                onMusicFormChange={setMusicForm}
                onArtFormChange={setArtForm}
                onArtFilesChange={setArtFile}
                onArtTitleBaseChange={() => {}}
                onTestimonialFormChange={setTestimonialForm}
                onBlogFormChange={setBlogForm as any}
                onMusicSubmit={handleMusicSubmit}
                onArtSubmit={handleArtSubmit}
                onArtBulkUpload={handleArtBulkUpload}
                onTestimonialSubmit={handleTestimonialSubmit}
                onBlogSubmit={() => {}} // Legacy handler not needed for new blog system
                onSyncYouTube={handleSyncYouTube}
                isUploading={isUploading || isFileUploading}
                isYouTubeSyncing={isYouTubeSyncing || isYouTubeSyncingHook}
              />

              <DatabaseExplorer
                activeTab={activeTab}
                music={music}
                arts={arts}
                blogs={{ data: [] }}
                testimonials={testimonials}
                bookings={bookings}
                onEdit={handleEdit}
                onToggleFavorite={handleToggleFavorite}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      </div>

      {/* Custom Dialogs */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
      />
      <ToastContainer toasts={toasts} />
    </div>
  )
}
