"use client"

import { useState, FormEvent, ChangeEvent } from "react"

interface ArtFormProps {
  form: {
    title: string
    imageUrl: string
    _id: string | null
  }
  artFiles: FileList | null
  artTitleBase: string
  onFormChange: (form: any) => void
  onFilesChange: (files: FileList | null) => void
  onTitleBaseChange: (title: string) => void
  onSubmit: (e: FormEvent) => void
  onBulkUpload: (e: FormEvent) => void
  isUploading: boolean
}

export default function ArtForm({
  form,
  artFiles,
  artTitleBase,
  onFormChange,
  onFilesChange,
  onTitleBaseChange,
  onSubmit,
  onBulkUpload,
  isUploading,
}: ArtFormProps) {
  return (
    <div className="space-y-6">
      <form onSubmit={onBulkUpload} className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
            Bulk Upload Artworks
          </label>
          <input
            type="text"
            placeholder="Base Title (e.g., 'Abstract Art')"
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30 mb-4"
            value={artTitleBase}
            onChange={e => onTitleBaseChange(e.target.value)}
            required
          />
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full text-sm text-white/60 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/5 file:text-gold hover:file:bg-primary hover:file:text-black file:transition-all file:cursor-pointer"
            onChange={e => onFilesChange(e.target.files)}
            required
          />
        </div>
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {isUploading ? "PROCESSING..." : `UPLOAD BATCH (${artFiles?.length || 0})`}
          </button>
        </div>
      </form>
      <div className="h-[1px] bg-white/5" />
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
            Single Artwork Entry
          </label>
          <input
            type="text"
            placeholder="Art Title"
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
            value={form.title}
            onChange={e => onFormChange({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {isUploading ? "PROCESSING..." : form._id ? "UPDATE ART" : "ADD ART"}
          </button>
          {form._id && (
            <button
              type="button"
              onClick={() => onFormChange({ title: "", imageUrl: "", _id: null })}
              className="px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 text-xs font-black uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
