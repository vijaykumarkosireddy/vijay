"use client"

import BlogItem from "./BlogItem"

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

interface BlogListProps {
  blogs: Blog[]
  onEdit: (blog: Blog) => void
  onTogglePublished: (id: string, currentStatus: boolean) => void
  onToggleFavorite: (id: string, currentStatus: boolean) => void
  onDelete: (id: string) => void
}

export default function BlogList({
  blogs,
  onEdit,
  onTogglePublished,
  onToggleFavorite,
  onDelete,
}: BlogListProps) {
  // Group blogs by status
  const drafts = blogs.filter((blog) => blog.isDraft)
  const published = blogs.filter((blog) => !blog.isDraft && blog.published)
  const unpublished = blogs.filter((blog) => !blog.isDraft && !blog.published)

  const Section = ({
    title,
    description,
    blogs,
    emptyMessage,
  }: {
    title: string
    description: string
    blogs: Blog[]
    emptyMessage: string
  }) => (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-black text-gold mb-2">{title}</h3>
        <p className="text-sm text-white/60">{description}</p>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-black/20 border border-white/10 rounded-2xl p-8 text-center">
          <p className="text-white/40">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <BlogItem
              key={blog._id}
              blog={blog}
              onEdit={() => onEdit(blog)}
              onTogglePublished={() => onTogglePublished(blog._id, blog.published)}
              onToggleFavorite={() => onToggleFavorite(blog._id, blog.isFavorite)}
              onDelete={() => onDelete(blog._id)}
            />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
        <h2 className="text-xl font-black text-gold mb-2">📚 Blog Management</h2>
        <p className="text-sm text-white/60">
          Manage all your blog posts here. Drafts are work in progress, published posts are live on your
          site, and unpublished posts are hidden from public view.
        </p>
      </div>

      {/* Drafts Section */}
      <Section
        title="📝 Drafts"
        description="Work in progress - not visible to anyone but you"
        blogs={drafts}
        emptyMessage="No drafts yet. Create a new blog post and save it as a draft!"
      />

      {/* Published Section */}
      <Section
        title="✅ Published"
        description="Live on your website and visible to everyone"
        blogs={published}
        emptyMessage="No published blogs yet. Publish a draft to make it live!"
      />

      {/* Unpublished Section */}
      <Section
        title="🔴 Unpublished"
        description="Previously published but now hidden from public"
        blogs={unpublished}
        emptyMessage="No unpublished blogs. These are posts you've taken offline."
      />
    </div>
  )
}
