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
import { API_ENDPOINTS, COLLECTIONS } from "@/lib/constants/api-endpoints"
import { AdminHeader, AdminTabs, FormsContainer, DatabaseExplorer } from "@/components/admin"

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

  const [artFiles, setArtFiles] = useState<FileList | null>(null)
  const [artTitleBase, setArtTitleBase] = useState("")
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

  useEffect(() => {
    const auth = getCookie("admin_auth")
    const loginTimestamp = getCookie("admin_login_time")

    if (!auth || !loginTimestamp) {
      router.push("/")
    } else {
      const loginTime = parseInt(loginTimestamp)
      const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds

      if (Date.now() - loginTime >= oneHour) {
        // Session expired
        deleteCookie("admin_auth")
        deleteCookie("admin_login_time")
        router.push("/")
      } else {
        setIsAuthenticated(true)
      }
    }
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

  const handleArtBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!artFiles || artFiles.length === 0) return

    const result = await uploadMultipleFiles(artFiles, artTitleBase)
    if (result.success) {
      setArtFiles(null)
      setArtTitleBase("")
      fetchItems("arts")
      addToast("success", `Uploaded ${result.uploadedCount} art piece(s)`)
    } else {
      addToast("error", result.error || "Failed to upload art")
    }
  }

  const handleArtSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let result
    if (artForm._id) {
      result = await update("ARTS", artForm._id, artForm)
    } else {
      result = await create("ARTS", artForm)
    }

    if (result.success) {
      setArtForm({ title: "", imageUrl: "", _id: null })
      fetchItems("arts")
      addToast("success", artForm._id ? "Art updated" : "Art added")
    } else {
      addToast("error", result.error || "Failed to save art")
    }
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

  const handleEdit = (item: any) => {
    if (activeTab === "music") {
      setMusicForm({ ...item })
    } else if (activeTab === "arts") {
      setArtForm({ ...item })
    } else if (activeTab === "testimonials") {
      setTestimonialForm({ ...item, file: null })
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 pb-32 animate-reveal">
      <AdminHeader onLogout={handleLogout} />

      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-12">
        <FormsContainer
          activeTab={activeTab}
          musicForm={musicForm}
          artForm={artForm}
          artFiles={artFiles}
          artTitleBase={artTitleBase}
          testimonialForm={testimonialForm}
          onMusicFormChange={setMusicForm}
          onArtFormChange={setArtForm}
          onArtFilesChange={setArtFiles}
          onArtTitleBaseChange={setArtTitleBase}
          onTestimonialFormChange={setTestimonialForm}
          onMusicSubmit={handleMusicSubmit}
          onArtSubmit={handleArtSubmit}
          onArtBulkUpload={handleArtBulkUpload}
          onTestimonialSubmit={handleTestimonialSubmit}
          onSyncYouTube={handleSyncYouTube}
          isUploading={isUploading || isFileUploading}
          isYouTubeSyncing={isYouTubeSyncing || isYouTubeSyncingHook}
        />

        <DatabaseExplorer
          activeTab={activeTab}
          music={music}
          arts={arts}
          testimonials={testimonials}
          bookings={bookings}
          onEdit={handleEdit}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
        />
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
