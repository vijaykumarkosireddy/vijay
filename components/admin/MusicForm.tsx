"use client"

import { useState, FormEvent } from "react"

interface MusicFormProps {
  form: {
    title: string
    url: string
    platform: string
    _id: string | null
  }
  onFormChange: (form: any) => void
  onSubmit: (e: FormEvent) => void
  isUploading: boolean
  isYouTubeSyncing: boolean
  onSyncYouTube: () => void
}

export default function MusicForm({
  form,
  onFormChange,
  onSubmit,
  isUploading,
  isYouTubeSyncing,
  onSyncYouTube,
}: MusicFormProps) {
  return (
    <div className="space-y-6">
      <button
        onClick={onSyncYouTube}
        disabled={isYouTubeSyncing}
        className="w-full md:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-gold/30 text-gold font-black text-[11px] uppercase tracking-[0.3em] hover:bg-primary hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isYouTubeSyncing ? "SYNCING..." : "SYNC YOUTUBE (Auto-Fallback)"}
      </button>
      <div className="h-[1px] bg-white/5" />
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Video Title"
          className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
          value={form.title}
          onChange={e => onFormChange({ ...form, title: e.target.value })}
          required
        />
        <input
          type="url"
          placeholder="YouTube URL"
          className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
          value={form.url}
          onChange={e => onFormChange({ ...form, url: e.target.value })}
          required
        />
        <select
          className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white"
          value={form.platform}
          onChange={e => onFormChange({ ...form, platform: e.target.value })}
        >
          <option value="YouTube">YouTube</option>
          <option value="Vimeo">Vimeo</option>
          <option value="Other">Other</option>
        </select>
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isUploading}
            className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {isUploading ? "PROCESSING..." : form._id ? "UPDATE MUSIC" : "ADD MUSIC"}
          </button>
          {form._id && (
            <button
              type="button"
              onClick={() => onFormChange({ title: "", url: "", platform: "YouTube", _id: null })}
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
