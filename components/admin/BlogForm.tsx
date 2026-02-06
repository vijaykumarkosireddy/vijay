"use client"

import { useState, FormEvent } from "react"

interface BlogFormProps {
  form: {
    title: string
    excerpt: string
    content: string
    tags: string[]
    image: string | null
    published: boolean
    _id: string | null
  }
  onFormChange: (form: any) => void
  onSubmit: (e: FormEvent) => void
  isUploading: boolean
}

export default function BlogForm({ form, onFormChange, onSubmit, isUploading }: BlogFormProps) {
  const [tagInput, setTagInput] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      onFormChange({ ...form, tags: [...form.tags, tagInput.trim()] })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    onFormChange({ ...form, tags: form.tags.filter(t => t !== tag) })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      onFormChange({ ...form, image: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
            Title *
          </label>
          <input
            type="text"
            placeholder="Blog Post Title"
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
            value={form.title}
            onChange={e => onFormChange({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
            Excerpt *
          </label>
          <textarea
            placeholder="Short description (shown in lists)"
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30 min-h-[100px]"
            value={form.excerpt}
            onChange={e => onFormChange({ ...form, excerpt: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
            Content (Markdown) *
          </label>
          <textarea
            placeholder="Paste your markdown content here..."
            className="w-full rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30 min-h-[400px] font-mono"
            value={form.content}
            onChange={e => onFormChange({ ...form, content: e.target.value })}
            required
          />
          <p className="text-xs text-white/40 mt-2">
            Supports markdown: **bold**, *italic*, `code`, # headings, etc.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-black uppercase tracking-widest text-white/40 mb-3">
            Tags
          </label>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder="Add tag"
              className="flex-1 rounded-2xl bg-black/40 border border-white/10 px-6 py-4 text-sm focus:ring-2 ring-gold font-medium text-white placeholder:text-white/30"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyPress={e => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
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
            {form.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-gold text-xs font-bold"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
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

        <div className="md:col-span-2 flex items-center gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={e => onFormChange({ ...form, published: e.target.checked })}
              className="w-5 h-5 rounded bg-black/40 border border-white/10 text-gold focus:ring-2 focus:ring-gold"
            />
            <span className="text-sm font-bold text-white/80">Publish immediately</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={isUploading}
          className="flex-1 md:flex-none px-10 py-4 rounded-2xl bg-primary text-black font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {isUploading ? "SAVING..." : form._id ? "UPDATE POST" : "CREATE POST"}
        </button>
        {form._id && (
          <button
            type="button"
            onClick={() =>
              onFormChange({
                title: "",
                excerpt: "",
                content: "",
                tags: [],
                image: null,
                published: false,
                _id: null,
              })
            }
            className="px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 text-xs font-black uppercase tracking-widest transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
