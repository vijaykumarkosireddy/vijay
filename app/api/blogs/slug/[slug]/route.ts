import { NextResponse } from "next/server"
import { getBlogPostBySlug } from "@/lib/db-helpers"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await getBlogPostBySlug(params.slug)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    // Only return published, non-draft blogs to public
    if (!post.published || post.isDraft) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching blog post by slug:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}
