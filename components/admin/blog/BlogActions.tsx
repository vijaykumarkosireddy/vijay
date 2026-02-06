"use client"

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

interface BlogActionsProps {
  blog: Blog
  onEdit: () => void
  onTogglePublished: () => void
  onToggleFavorite: () => void
  onDelete: () => void
  variant?: "compact" | "full"
}

export default function BlogActions({
  blog,
  onEdit,
  onTogglePublished,
  onToggleFavorite,
  onDelete,
  variant = "full",
}: BlogActionsProps) {
  return (
    <div className={`flex ${variant === "compact" ? "gap-2" : "gap-3"} flex-wrap`}>
      {/* Edit */}
      <button
        onClick={onEdit}
        className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-xs font-bold transition-all"
      >
        ✏️ Edit
      </button>

      {/* Toggle Published */}
      {blog.published ? (
        <button
          onClick={onTogglePublished}
          className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all"
        >
          🔴 Unpublish
        </button>
      ) : !blog.isDraft ? (
        <button
          onClick={onTogglePublished}
          className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 text-xs font-bold transition-all"
        >
          🟢 Publish
        </button>
      ) : null}

      {/* Toggle Favorite */}
      <button
        onClick={onToggleFavorite}
        className={`px-4 py-2 rounded-xl ${blog.isFavorite
            ? "bg-gold/20 border-gold/40 text-gold"
            : "bg-white/5 border-white/10 text-white/60 hover:border-gold/30"
          } border text-xs font-bold transition-all`}
      >
        {blog.isFavorite ? "⭐ Favorited" : "☆ Add Favorite"}
      </button>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all"
      >
        🗑️ Delete
      </button>
    </div>
  )
}
