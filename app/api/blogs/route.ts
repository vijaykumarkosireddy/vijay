import { NextResponse } from "next/server"
import { getBlogPosts, addBlogPost } from "@/lib/db-helpers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get("published")
    const isDraft = searchParams.get("isDraft")
    const tag = searchParams.get("tag")

    const filters: any = {}
    if (published !== null) {
      filters.published = published === "true"
    }
    if (isDraft !== null) {
      filters.isDraft = isDraft === "true"
    }
    if (tag) {
      filters.tag = tag
    }

    const posts = await getBlogPosts(filters)
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const blogPost = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      tags: data.tags || [],
      image: data.image || null,
      published: data.published ?? false,
      isDraft: data.isDraft ?? true,
      isFavorite: data.isFavorite ?? false,
    }

    const result = await addBlogPost(blogPost)
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
