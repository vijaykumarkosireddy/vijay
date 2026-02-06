"use client"

import MusicForm from "./MusicForm"
import ArtForm from "./ArtForm"
import TestimonialForm from "./TestimonialForm"
import BlogForm from "./BlogForm"

interface FormsContainerProps {
  activeTab: string
  musicForm: {
    title: string
    url: string
    platform: string
    _id: string | null
  }
  artForm: {
    title: string
    imageUrl: string
    _id: string | null
  }
  artFiles: File | null
  artTitleBase: string
  testimonialForm: {
    name: string
    role: string
    text: string
    file: File | null
    _id: string | null
  }
  blogForm: {
    title: string
    excerpt: string
    content: string
    tags: string[]
    image: string | null
    published: boolean
    _id: string | null
  }
  onMusicFormChange: (form: any) => void
  onArtFormChange: (form: any) => void
  onArtFilesChange: (file: File | null) => void
  onArtTitleBaseChange: (title: string) => void
  onTestimonialFormChange: (form: any) => void
  onBlogFormChange: (form: any) => void
  onMusicSubmit: (e: React.FormEvent) => void
  onArtSubmit: (e: React.FormEvent) => void
  onArtBulkUpload: (e: React.FormEvent) => void
  onTestimonialSubmit: (e: React.FormEvent) => void
  onBlogSubmit: (e: React.FormEvent) => void
  onSyncYouTube: () => void
  isUploading: boolean
  isYouTubeSyncing: boolean
}

export default function FormsContainer({
  activeTab,
  musicForm,
  artForm,
  artFiles,
  artTitleBase,
  testimonialForm,
  blogForm,
  onMusicFormChange,
  onArtFormChange,
  onArtFilesChange,
  onArtTitleBaseChange,
  onTestimonialFormChange,
  onBlogFormChange,
  onMusicSubmit,
  onArtSubmit,
  onArtBulkUpload,
  onTestimonialSubmit,
  onBlogSubmit,
  onSyncYouTube,
  isUploading,
  isYouTubeSyncing,
}: FormsContainerProps) {
  if (activeTab === "bookings") return null

  return (
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
        {musicForm._id || testimonialForm._id || artForm._id || blogForm._id
          ? "Edit Entry"
          : "Add New Entry"}
      </h2>

      {activeTab === "music" && (
        <MusicForm
          form={musicForm}
          onFormChange={onMusicFormChange}
          onSubmit={onMusicSubmit}
          isUploading={isUploading}
          isYouTubeSyncing={isYouTubeSyncing}
          onSyncYouTube={onSyncYouTube}
        />
      )}

      {activeTab === "arts" && (
        <ArtForm
          form={artForm}
          artFiles={artFiles}
          artTitleBase={artTitleBase}
          onFormChange={onArtFormChange}
          onFilesChange={onArtFilesChange}
          onTitleBaseChange={onArtTitleBaseChange}
          onSubmit={onArtSubmit}
          onBulkUpload={onArtBulkUpload}
          isUploading={isUploading}
        />
      )}

      {activeTab === "blogs" && (
        <BlogForm
          form={blogForm}
          onFormChange={onBlogFormChange}
          onSubmit={onBlogSubmit}
          isUploading={isUploading}
        />
      )}

      {activeTab === "testimonials" && (
        <TestimonialForm
          form={testimonialForm}
          onFormChange={onTestimonialFormChange}
          onSubmit={onTestimonialSubmit}
          isUploading={isUploading}
        />
      )}
    </div>
  )
}
