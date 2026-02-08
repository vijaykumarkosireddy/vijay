"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  slug: string
  image: string | null
  tags: string[]
  publishedAt?: string
}

export default function FeaturedBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedBlogs = async () => {
      try {
        const response = await fetch("/api/blogs/featured")
        if (response.ok) {
          const data = await response.json()
          setBlogs(data.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch featured blogs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedBlogs()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    )
  }

  if (blogs.length === 0) {
    return null
  }

  return (
    <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-reveal">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-gold" />
          <h2 className="text-3xl md:text-5xl font-black">
            FEATURED <span className="text-gold">STORIES</span>
          </h2>
          <Sparkles className="w-6 h-6 text-gold" />
        </div>
        <p className="text-white/60 max-w-2xl mx-auto">
          Handpicked insights on music, art, and creativity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog, index) => (
          <Link
            key={blog._id}
            href={`/blogs/${blog.slug}`}
            className="group bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-300 flex flex-col animate-reveal"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              {blog.image ? (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                  <span className="text-3xl">✍️</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

              {/* First tag */}
              {blog.tags.length > 0 && (
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-gold/90 text-black text-xs font-black uppercase tracking-wider rounded-lg">
                    {blog.tags[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-black mb-2 group-hover:text-gold transition-colors line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-white/60 text-sm line-clamp-2 font-light leading-relaxed flex-1">
                {blog.excerpt}
              </p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
                  Read More
                </span>
                <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-black font-black uppercase tracking-wider rounded-full hover:bg-gold/90 transition-all"
        >
          View All Stories
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
