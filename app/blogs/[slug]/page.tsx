"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { blogApi, BlogFormData } from "@/lib/services/blogApi"
import StyledMarkdown from "@/components/shared/StyledMarkdown"
import ShareButton from "@/components/shared/ShareButton"

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [blog, setBlog] = useState<BlogFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const result = await blogApi.fetchBlogBySlug(slug)
        setBlog(result)
      } catch (error) {
        console.error("Failed to fetch blog:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlog()
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 flex justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!blog) {
    return notFound()
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 mb-12">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-gold/60 hover:text-gold text-xs font-black uppercase tracking-widest mb-8 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Stories
        </Link>

        <h1 className="text-4xl md:text-6xl font-black mb-6 title-reveal leading-tight">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-8 border-b border-white/10 pb-8">
          <div className="flex gap-2">
            {blog.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gold uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          {/* Add date if available in API response, otherwise skip */}
        </div>
      </div>

      {/* Featured Image */}
      {blog.image && (
        <div className="max-w-6xl mx-auto px-6 mb-16 animate-reveal">
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-gold/5">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 animate-reveal" style={{ animationDelay: "200ms" }}>
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed mb-12 italic border-l-4 border-gold/40 pl-6">
            {blog.excerpt}
          </p>

          <StyledMarkdown content={blog.content} />
        </div>

        {/* Footer Actions */}
        <div className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center">
          <Link
            href="/blogs"
            className="text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
          >
            Read More Stories
          </Link>
          <ShareButton
            title={blog.title}
            text={blog.excerpt}
            url={`/blogs/${blog.slug}`} // Assuming ShareButton handles full URL or base URL
          />
        </div>
      </article>
    </div>
  )
}
