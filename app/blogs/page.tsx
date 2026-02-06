"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { blogApi } from "@/lib/services/blogApi"

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  slug: string
  image: string | null
  tags: string[]
  publishedAt: string
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const result = await blogApi.fetchBlogs({ published: true, isDraft: false })
        setBlogs(result.data || [])
      } catch (error) {
        console.error("Failed to fetch blogs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 flex justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-16 animate-reveal">
        <h1 className="text-4xl md:text-6xl font-black mb-6 title-reveal">
          LATEST <span className="text-gold">STORIES</span>
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto text-lg">
          Insights, updates, and thoughts on music, art, and technology.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-white/40 uppercase tracking-widest font-bold">
            No stories published yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog.slug}`}
              className="group bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-300 flex flex-col h-full animate-reveal"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                    <span className="text-4xl">✍️</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

                {/* Tags overlay */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {blog.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gold/90 text-black text-xs font-black uppercase tracking-wider rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-2xl font-black mb-3 group-hover:text-gold transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-white/60 text-sm mb-6 line-clamp-3 font-light leading-relaxed flex-1">
                  {blog.excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
                    Read Story
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
