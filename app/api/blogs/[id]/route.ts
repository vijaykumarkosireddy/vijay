import { NextResponse } from "next/server"
import {
  getBlogPost,
  updateBlogPost,
  deleteBlogPost,
  toggleBlogPublished,
  toggleBlogFavorite,
} from "@/lib/db-helpers"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const post = await getBlogPost(id)
    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    await updateBlogPost(id, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const value = searchParams.get("value") === "true"

    if (action === "togglePublished") {
      await toggleBlogPublished(id, value)
      return NextResponse.json({ success: true })
    }

    if (action === "toggleFavorite") {
      await toggleBlogFavorite(id, value)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error patching blog post:", error)
    return NextResponse.json({ error: "Failed to patch blog post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await deleteBlogPost(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}
