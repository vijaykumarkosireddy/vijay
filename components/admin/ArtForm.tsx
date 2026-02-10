"use client"

import { FormEvent, ChangeEvent } from "react"

interface ArtFormProps {
  form: {
    title: string
    imageUrl: string
    _id: string | null
  }
  artFiles: File | null
  artTitleBase: string
  onFormChange: (form: any) => void
  onFilesChange: (file: File | null) => void
  onTitleBaseChange: (title: string) => void
  onSubmit: (e: FormEvent) => void
  onBulkUpload: (e: FormEvent) => void
  isUploading: boolean
}

export default function ArtForm({
  form,
  artFiles,
  onFormChange,
  onFilesChange,
  onSubmit,
  isUploading,
}: ArtFormProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onFilesChange(file)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!artFiles && !form._id) {
      alert("Please select an image file")
      return
    }
    onSubmit(e)
  }

  return (
    <div className="space-y-6 relative">
      {isUploading && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-gold/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-1">
              <p className="text-gold font-black text-sm uppercase tracking-widest">Uploading</p>
              <p className="text-white/40 text-xs">Processing your artwork...</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
            Artwork Entry
          </label>
          <input
            type="text"
            placeholder="Art Title"
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30 mb-4"
            value={form.title}
            onChange={e => onFormChange({ ...form, title: e.target.value })}
            required
            disabled={isUploading}
          />
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-white/60 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/5 file:text-gold hover:file:bg-primary hover:file:text-black file:transition-all file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onChange={handleFileChange}
            required={!form._id}
            disabled={isUploading}
          />
          {artFiles && <p className="mt-2 text-xs text-gold">Selected: {artFiles.name}</p>}
          {form._id && !artFiles && (
            <p className="mt-2 text-xs text-white/40">Leave empty to keep existing image</p>
          )}
        </div>
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 relative overflow-hidden"
          >
            {isUploading && (
              <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
            <span className="relative flex items-center justify-center gap-2">
              {isUploading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isUploading ? "UPLOADING..." : form._id ? "UPDATE ART" : "ADD ART"}
            </span>
          </button>
          {form._id && (
            <button
              type="button"
              onClick={() => {
                onFormChange({ title: "", imageUrl: "", _id: null })
                onFilesChange(null)
              }}
              className="px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 text-xs font-black uppercase tracking-widest transition-all"
              disabled={isUploading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
