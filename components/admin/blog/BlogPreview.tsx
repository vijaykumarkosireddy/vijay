"use client"

import StyledMarkdown from "@/components/shared/StyledMarkdown"
import { BlogFormData } from "@/lib/services/blogApi"

interface BlogPreviewProps {
  blog: BlogFormData
  onBack: () => void
  onSaveDraft: () => void
  onPublish: () => void
  isSubmitting: boolean
}

export default function BlogPreview({
  blog,
  onBack,
  onSaveDraft,
  onPublish,
  isSubmitting,
}: BlogPreviewProps) {
  return (
    <div className="space-y-8 animate-reveal">
      {/* Preview Header */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
        <h2 className="text-2xl font-black text-gold mb-2">👀 Blog Preview</h2>
        <p className="text-sm text-white/60">
          This is how your blog will appear when published. Review it carefully, then choose an option
          below.
        </p>
      </div>

      {/* Blog Preview Content */}
      <div className="bg-black/20 border border-white/10 rounded-2xl p-8 md:p-12">
        {/* Featured Image */}
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8 border border-white/10"
          />
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black mb-4 title-reveal">{blog.title}</h1>

        {/* Tags */}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-xl bg-gold/10 border border-gold/20 text-gold text-xs font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Excerpt */}
        <p className="text-lg text-white/60 mb-8 italic border-l-4 border-accent/40 pl-6 py-2">
          {blog.excerpt}
        </p>

        {/* Divider */}
        <hr className="my-8 border-t border-border/20" />

        {/* Markdown Content */}
        <StyledMarkdown content={blog.content} />
      </div>

      {/* Action Buttons */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-white/10 p-6 -mx-6 -mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Back to Editing */}
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-6 py-4 rounded-2xl border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/30 font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              « Back to Editing
            </button>

            {/* Save as Draft */}
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSubmitting}
              className="px-6 py-4 rounded-2xl border-2 border-yellow-500/30 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:border-yellow-500/50 font-black text-sm uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div>
                💾 Save as Draft
                <div className="text-xs font-normal normal-case tracking-normal mt-1 text-yellow-500/70">
                  Saved but not visible to public
                </div>
              </div>
            </button>

            {/* Publish Now */}
            <button
              type="button"
              onClick={onPublish}
              disabled={isSubmitting}
              className="px-6 py-4 rounded-2xl bg-green-500 text-black hover:bg-green-400 font-black text-sm uppercase tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
            >
              <div>
                ✅ Publish Now
                <div className="text-xs font-normal normal-case tracking-normal mt-1 text-black/70">
                  Will be live on your site
                </div>
              </div>
            </button>
          </div>

          {isSubmitting && (
            <p className="text-center text-white/60 text-sm mt-4">Processing your request...</p>
          )}
        </div>
      </div>
    </div>
  )
}
