"use client"

import { useState, FormEvent, ChangeEvent } from "react"

interface TestimonialFormProps {
  form: {
    name: string
    role: string
    text: string
    file: File | null
    _id: string | null
  }
  onFormChange: (form: any) => void
  onSubmit: (e: FormEvent) => void
  isUploading: boolean
}

export default function TestimonialForm({
  form,
  onFormChange,
  onSubmit,
  isUploading,
}: TestimonialFormProps) {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
          Name
        </label>
        <input
          type="text"
          placeholder="Client Name"
          className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
          value={form.name}
          onChange={e => onFormChange({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
          Role/Title
        </label>
        <input
          type="text"
          placeholder="Professional Title"
          className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
          value={form.role}
          onChange={e => onFormChange({ ...form, role: e.target.value })}
          required
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
          Testimonial Text
        </label>
        <textarea
          placeholder="Client testimonial..."
          className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30 h-32 resize-none"
          value={form.text}
          onChange={e => onFormChange({ ...form, text: e.target.value })}
          required
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
          Client Photo (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          className="w-full text-sm text-white/60 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/5 file:text-gold hover:file:bg-primary hover:file:text-black file:transition-all file:cursor-pointer"
          onChange={e => onFormChange({ ...form, file: e.target.files?.[0] || null })}
        />
      </div>
      <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={isUploading}
          className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {isUploading ? "PROCESSING..." : form._id ? "UPDATE TESTIMONIAL" : "SAVE TESTIMONIAL"}
        </button>
        {form._id && (
          <button
            type="button"
            onClick={() => onFormChange({ name: "", role: "", text: "", file: null, _id: null })}
            className="px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 text-xs font-black uppercase tracking-widest transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
