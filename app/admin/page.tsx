"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SITE_CONTENT } from "@/constants/content"
import Image from "next/image"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import { ToastContainer, ToastProps } from "@/components/shared/Toast"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("music")
  const [musicList, setMusicList] = useState([])
  const [artList, setArtList] = useState([])
  const [testimonialList, setTestimonialList] = useState([])
  const [bookingList, setBookingList] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
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

  // Form States
  const [musicForm, setMusicForm] = useState({
    title: "",
    url: "",
    platform: "YouTube",
    _id: null as string | null,
  })

  const [artFiles, setArtFiles] = useState<FileList | null>(null)
  const [artTitleBase, setArtTitleBase] = useState("")

  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "",
    text: "",
    file: null as File | null,
    _id: null as string | null,
  })

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth")
    if (!auth) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
      fetchItems()
    }
  }, [router])

  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, message, onClose: () => removeToast(id) }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const fetchItems = async () => {
    const [musicRes, artRes, testRes, bookRes] = await Promise.all([
      fetch("/api/music"),
      fetch("/api/arts"),
      fetch("/api/testimonials"),
      fetch("/api/bookings"),
    ])
    if (musicRes.ok) setMusicList(await musicRes.json())
    if (artRes.ok) setArtList(await artRes.json())
    if (testRes.ok) setTestimonialList(await testRes.json())
    if (bookRes.ok) setBookingList(await bookRes.json())
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_auth")
    router.push("/")
  }

  /* --- CONTENT OPERATIONS --- */

  const handleToggleFavorite = async (collection: string, id: string, currentStatus: boolean) => {
    const collectionName = collection.toUpperCase()
    const res = await fetch("/api/manage", {
      method: "PATCH",
      body: JSON.stringify({ collection: collectionName, id, status: !currentStatus }),
      headers: { "Content-Type": "application/json" },
    })
    if (res.ok) {
      fetchItems()
      addToast("success", currentStatus ? "Removed from favorites" : "Added to favorites")
    } else {
      addToast("error", "Failed to update favorite status")
    }
  }

  const handleDelete = (collection: string, id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Item",
      message: "Are you sure you want to delete this item? This action cannot be undone.",
      onConfirm: async () => {
        const collectionName = collection.toUpperCase()
        const res = await fetch(`/api/manage?collection=${collectionName}&id=${id}`, {
          method: "DELETE",
        })
        if (res.ok) {
          fetchItems()
          addToast("success", "Item deleted successfully")
        } else {
          addToast("error", "Failed to delete item")
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false })
      },
    })
  }

  const handleSyncYouTube = async () => {
    setIsSyncing(true)
    const res = await fetch("/api/youtube/sync", { method: "POST" })
    const data = await res.json()
    setIsSyncing(false)
    if (data.success) {
      addToast("success", `Added ${data.added} new videos`)
    } else {
      addToast("error", `Sync failed: ${data.error}`)
    }
    fetchItems()
  }

  /* --- SUBMISSIONS --- */

  const handleMusicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = musicForm._id ? "PATCH" : "POST"
    const url = musicForm._id ? "/api/manage" : "/api/music"
    const payload = musicForm._id
      ? { collection: "MUSIC", id: musicForm._id, data: musicForm }
      : musicForm

    const res = await fetch(url, {
      method,
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })
    if (res.ok) {
      setMusicForm({ title: "", url: "", platform: "YouTube", _id: null })
      fetchItems()
      addToast("success", musicForm._id ? "Music updated" : "Music added")
    } else {
      addToast("error", "Failed to save music")
    }
  }

  const handleArtBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!artFiles || artFiles.length === 0) return
    setIsUploading(true)

    for (let i = 0; i < artFiles.length; i++) {
      const file = artFiles[i]
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
      if (uploadRes.ok) {
        const { url } = await uploadRes.json()
        await fetch("/api/arts", {
          method: "POST",
          body: JSON.stringify({
            title: `${artTitleBase} ${artFiles.length > 1 ? i + 1 : ""}`.trim(),
            imageUrl: url,
          }),
          headers: { "Content-Type": "application/json" },
        })
      }
    }
    setIsUploading(false)
    setArtFiles(null)
    setArtTitleBase("")
    fetchItems()
    addToast("success", `Uploaded ${artFiles.length} art piece(s)`)
  }

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    let imageUrl = testimonialForm._id
      ? (testimonialList as any[]).find((t: any) => t._id === testimonialForm._id)?.imageUrl
      : ""

    if (testimonialForm.file) {
      const formData = new FormData()
      formData.append("file", testimonialForm.file)
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
      if (uploadRes.ok) {
        const data = await uploadRes.json()
        imageUrl = data.url
      }
    }

    const method = testimonialForm._id ? "PATCH" : "POST"
    const url = testimonialForm._id ? "/api/manage" : "/api/testimonials"
    const payload = testimonialForm._id
      ? {
          collection: "TESTIMONIALS",
          id: testimonialForm._id,
          data: { ...testimonialForm, imageUrl, file: undefined },
        }
      : { ...testimonialForm, imageUrl, file: undefined }

    const res = await fetch(url, {
      method,
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })

    if (res.ok) {
      setTestimonialForm({ name: "", role: "", text: "", file: null, _id: null })
      fetchItems()
      addToast("success", testimonialForm._id ? "Testimonial updated" : "Testimonial added")
    } else {
      addToast("error", "Failed to save testimonial")
    }
    setIsUploading(false)
  }

  if (!isAuthenticated) return null

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 pb-32 animate-reveal">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gold italic">DASHBOARD</h1>
          <p className="text-sm text-foreground/30 mt-1 uppercase tracking-widest">
            {SITE_CONTENT.NAME} • MASTER CONTROL
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-xs uppercase tracking-widest hover:bg-red-500 transition-all hover:text-white hover:border-red-500"
        >
          Terminate Session
        </button>
      </div>

      <div className="mb-12 grid grid-cols-2 md:flex gap-4 border-b border-border">
        {["music", "arts", "testimonials", "bookings"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-xs font-black tracking-[0.3em] uppercase transition-all border-b-2 whitespace-nowrap ${activeTab === tab ? "border-gold text-gold" : "border-transparent text-foreground/30"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {/* FORMS SECTION - NOW AT TOP */}
        {activeTab !== "bookings" && (
          <div className="glass p-8 rounded-[2.5rem] border-primary/10">
            <h2 className="mb-8 text-lg font-black italic tracking-tighter uppercase text-gold flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 5v14m7-7H5" />
              </svg>
              {musicForm._id || testimonialForm._id ? "Edit Entry" : "Add New Entry"}
            </h2>

            {activeTab === "music" && (
              <div className="space-y-6">
                <button
                  onClick={handleSyncYouTube}
                  disabled={isSyncing}
                  className="w-full md:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-gold/30 text-gold font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gold hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSyncing ? "SYNCING..." : "SYNC YOUTUBE (Auto-Fallback)"}
                </button>
                <div className="h-[1px] bg-white/5" />
                <form
                  onSubmit={handleMusicSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <input
                    type="text"
                    placeholder="Video Title"
                    className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
                    value={musicForm.title}
                    onChange={e => setMusicForm({ ...musicForm, title: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="YouTube URL"
                    className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
                    value={musicForm.url}
                    onChange={e => setMusicForm({ ...musicForm, url: e.target.value })}
                    required
                  />
                  <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                      {musicForm._id ? "UPDATE ENTRY" : "PUBLISH LINK"}
                    </button>
                    {musicForm._id && (
                      <button
                        type="button"
                        onClick={() =>
                          setMusicForm({ title: "", url: "", platform: "YouTube", _id: null })
                        }
                        className="px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 text-xs font-black uppercase tracking-widest transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === "arts" && (
              <form
                onSubmit={handleArtBulkUpload}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2">
                    Collection Base Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Master Sketch"
                    className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
                    value={artTitleBase}
                    onChange={e => setArtTitleBase(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2">
                    Drop Multiple Files
                  </label>
                  <div className="relative group rounded-2xl border-2 border-dashed border-white/10 hover:border-gold/30 transition-all bg-black/20 overflow-hidden">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={e => setArtFiles(e.target.files)}
                      required
                    />
                    <div className="p-8 text-center">
                      <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
                        {artFiles ? `${artFiles.length} files selected` : "Select or Drop Images"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full md:w-auto px-10 py-4 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                  >
                    {isUploading ? "PROCESSING..." : `UPLOAD BATCH (${artFiles?.length || 0})`}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "testimonials" && (
              <form
                onSubmit={handleTestimonialSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <input
                  type="text"
                  placeholder="Author Name"
                  className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
                  value={testimonialForm.name}
                  onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Author Role (e.g. Student)"
                  className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
                  value={testimonialForm.role}
                  onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Feedback Content..."
                  className="md:col-span-2 w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium h-32 resize-none text-white placeholder:text-white/30"
                  value={testimonialForm.text}
                  onChange={e => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                  required
                />
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 px-2">
                    Author Avatar (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-full text-sm text-white/60 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/5 file:text-gold hover:file:bg-gold hover:file:text-black file:transition-all file:cursor-pointer"
                    onChange={e =>
                      setTestimonialForm({ ...testimonialForm, file: e.target.files?.[0] || null })
                    }
                  />
                </div>
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                  >
                    {isUploading
                      ? "PROCESSING..."
                      : testimonialForm._id
                        ? "UPDATE TESTIMONIAL"
                        : "SAVE TESTIMONIAL"}
                  </button>
                  {testimonialForm._id && (
                    <button
                      type="button"
                      onClick={() =>
                        setTestimonialForm({ name: "", role: "", text: "", file: null, _id: null })
                      }
                      className="px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover-border-white/30 text-xs font-black uppercase tracking-widest transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}

        {/* DATABASE EXPLORER SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/20">
              {activeTab === "bookings" ? "Inquiry Database" : "Active Database Explorer"}
            </h2>
            {activeTab === "bookings" && (
              <span className="text-xs font-black text-gold uppercase tracking-widest bg-gold/10 px-4 py-2 rounded-full border border-gold/20">
                {bookingList.length} Active Inquiries
              </span>
            )}
          </div>

          <div className="grid gap-4">
            {activeTab === "bookings" ? (
              bookingList.length === 0 ? (
                <div className="glass p-16 rounded-[2rem] text-center">
                  <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
                    No bookings yet
                  </p>
                </div>
              ) : (
                bookingList.map((b: any) => (
                  <div
                    key={b._id}
                    className="glass p-8 rounded-[2rem] flex justify-between items-start group hover:border-gold/30 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-5 uppercase tracking-tighter font-black text-4xl italic select-none">
                      #{b._id.slice(-4)}
                    </div>
                    <div className="space-y-4 relative z-10">
                      <div>
                        <h4 className="font-black text-xl italic tracking-tighter text-white">
                          {b.name}
                        </h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gold opacity-60 mt-1">
                          {b.interest}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-white/40 font-medium">
                          Contact: <span className="text-white/80">{b.email}</span> •{" "}
                          <span className="text-white/80">{b.phone}</span>
                        </p>
                        <p className="text-xs text-white/40 font-medium">
                          Date:{" "}
                          <span className="text-white/60">
                            {new Date(b.createdAt).toLocaleString()}
                          </span>
                        </p>
                      </div>
                      <div className="p-5 bg-black/30 rounded-2xl italic text-sm text-white/70 border-l-2 border-gold/20 leading-relaxed font-light">
                        "{b.message}"
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (activeTab === "music"
                ? musicList
                : activeTab === "arts"
                  ? artList
                  : testimonialList
              ).length === 0 ? (
              <div className="glass p-16 rounded-[2rem] text-center">
                <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
                  No items yet. Add one above!
                </p>
              </div>
            ) : (
              (activeTab === "music"
                ? musicList
                : activeTab === "arts"
                  ? artList
                  : testimonialList
              ).map((item: any) => (
                <div
                  key={item._id}
                  className="glass p-4 md:p-6 rounded-[2rem] flex flex-col md:flex-row gap-4 md:gap-6 md:justify-between md:items-center group hover:border-gold/30 transition-all"
                >
                  <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                    <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10 relative group-hover:border-gold/30 transition-all">
                      {item.imageUrl || item.thumbnail ? (
                        <Image
                          src={item.imageUrl || item.thumbnail}
                          alt=""
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex items-center justify-center p-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="opacity-20"
                          >
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                            <path d="M8 7h6" />
                            <path d="M8 11h8" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="font-black italic tracking-tighter text-white text-sm md:text-base truncate">
                        {item.title || item.name}
                      </h4>
                      <p className="text-[10px] uppercase font-black tracking-widest text-white/30">
                        {item.platform || item.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 md:flex-shrink-0 justify-end md:justify-start">
                    <button
                      onClick={() => {
                        if (activeTab === "music") setMusicForm({ ...item })
                        if (activeTab === "testimonials")
                          setTestimonialForm({ ...item, file: null })
                      }}
                      className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-gold hover:bg-gold/10 hover:border-gold/30 flex items-center justify-center transition-all group/btn"
                      title="Edit Entry"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggleFavorite(activeTab, item._id, item.isFavorite)}
                      className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all group/btn relative ${item.isFavorite ? "bg-gold/20 border-2 border-gold text-gold shadow-lg shadow-gold/30" : "bg-white/5 border border-white/20 text-white/40 hover:text-gold hover:bg-gold/10 hover:border-gold/40"}`}
                      title={item.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={item.isFavorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="transition-transform group-hover/btn:scale-110"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      {item.isFavorite && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-gold rounded-full animate-pulse" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(activeTab, item._id)}
                      className="h-11 w-11 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400/60 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center transition-all group/btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="transition-transform group-hover/btn:scale-110"
                      >
                        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
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
