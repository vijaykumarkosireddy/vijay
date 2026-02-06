"use client"

import BlogActions from "./BlogActions"

interface Blog {
  _id: string
  title: string
  excerpt: string
  slug: string
  tags: string[]
  image: string | null
  published: boolean
  isDraft: boolean
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

interface BlogItemProps {
  blog: Blog
  onEdit: () => void
  onTogglePublished: () => void
  onToggleFavorite: () => void
  onDelete: () => void
}

export default function BlogItem({
  blog,
  onEdit,
  onTogglePublished,
  onToggleFavorite,
  onDelete,
}: BlogItemProps) {
  // Determine status
  const getStatus = () => {
    if (blog.isDraft) return { label: "Draft", color: "yellow" }
    if (blog.published) return { label: "Published", color: "green" }
    return { label: "Unpublished", color: "red" }
  }

  const status = getStatus()

  return (
    <div className="bg-black/40 border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Thumbnail */}
        {blog.image && (
          <div className="w-full md:w-40 h-32 flex-shrink-0">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover rounded-xl border border-white/10"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Title and Badges */}
          <div className="flex items-start gap-3 flex-wrap">
            <h3 className="text-xl font-bold text-white flex-1">{blog.title}</h3>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${status.color === "green"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : status.color === "yellow"
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
            >
              {status.label}
            </span>

            {/* Favorite Star */}
            {blog.isFavorite && <span className="text-gold text-xl">⭐</span>}
          </div>

          {/* Excerpt */}
          <p className="text-sm text-white/60 line-clamp-2">{blog.excerpt}</p>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>Slug: {blog.slug}</span>
            <span>•</span>
            <span>Created: {new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Actions */}
          <BlogActions
            blog={blog}
            onEdit={onEdit}
            onTogglePublished={onTogglePublished}
            onToggleFavorite={onToggleFavorite}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  )
}
