"use client"

import { useState, FormEvent } from "react"
import { BlogFormData } from "@/lib/services/blogApi"

interface BlogFormProps {
  form: BlogFormData
  onFormChange: (form: BlogFormData) => void
  onPreview: () => void
  onSaveDraft: () => void
  isUploading: boolean
  mode: "create" | "edit"
}

export default function BlogForm({
  form,
  onFormChange,
  onPreview,
  onSaveDraft,
  isUploading,
  mode,
}: BlogFormProps) {
  const [tagInput, setTagInput] = useState("")

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      onFormChange({ ...form, tags: [...form.tags, tagInput.trim()] })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    onFormChange({ ...form, tags: form.tags.filter((t) => t !== tag) })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      onFormChange({ ...form, image: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handlePreview = (e: FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.excerpt || !form.content) {
      alert("Please fill in title, excerpt, and content before previewing")
      return
    }
    onPreview()
  }

  const handleDraft = () => {
    if (!form.title || !form.excerpt || !form.content) {
      alert("Please fill in title, excerpt, and content before saving")
      return
    }
    onSaveDraft()
  }

  return (
    <div className="space-y-6">
      {/* Instructional Header */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gold mb-2">✍️ Create Your Blog Post</h3>
        <p className="text-sm text-white/60">
          Fill in the details below, then click <strong className="text-gold">Preview</strong> to see how
          it will look when published. Don&apos;t worry—you can save as a draft and come back later!
        </p>
      </div>

      <form className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
            Title *
          </label>
          <input
            type="text"
            placeholder="e.g., My Journey Into Web Development"
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
            value={form.title}
            onChange={(e) => onFormChange({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
            Excerpt (Short Summary) *
          </label>
          <textarea
            placeholder="A brief summary that will appear in blog listings (1-2 sentences)"
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30 min-h-[100px]"
            value={form.excerpt}
            onChange={(e) => onFormChange({ ...form, excerpt: e.target.value })}
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
            Content (Markdown Supported) *
          </label>
          <textarea
            placeholder="Write your blog content here using markdown...&#10;&#10;# Heading 1&#10;## Heading 2&#10;**Bold text** *Italic text*&#10;- List item&#10;`code`"
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30 min-h-[400px] font-mono"
            value={form.content}
            onChange={(e) => onFormChange({ ...form, content: e.target.value })}
            required
          />
          <p className="text-xs text-white/40 mt-2">
            💡 Tip: Use markdown for formatting: **bold**, *italic*, `code`, # headings, lists, and more!
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
            Tags (Optional)
          </label>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder="e.g., Web Development"
              className="flex-1 rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-gold hover:border-gold text-xs font-black uppercase tracking-widest transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-gold text-xs font-bold"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-400 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Image */}
        <div>
          <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
            Featured Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm text-white/60 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white/5 file:text-gold hover:file:bg-primary hover:file:text-black file:transition-all file:cursor-pointer"
            onChange={handleImageChange}
          />
          {form.image && (
            <div className="mt-4">
              <img
                src={form.image}
                alt="Preview"
                className="w-full max-w-md h-48 object-cover rounded-2xl border border-white/10"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={handlePreview}
            disabled={isUploading}
            className="flex-1 px-10 py-4 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
          >
            {isUploading ? "PROCESSING..." : "👀 PREVIEW"}
          </button>
          <button
            type="button"
            onClick={handleDraft}
            disabled={isUploading}
            className="px-8 py-4 rounded-2xl border-2 border-yellow-500/30 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:border-yellow-500/50 font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💾 SAVE AS DRAFT
          </button>
        </div>
      </form>
    </div>
  )
}
