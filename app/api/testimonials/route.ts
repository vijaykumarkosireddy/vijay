import { NextResponse } from "next/server"
import { getTestimonials, addTestimonial, updateItem } from "@/lib/db-helpers"
import { revalidateTag } from "next/cache"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const favorites = searchParams.get("favorites")

    const items = await getTestimonials(favorites === "true")

    return NextResponse.json(items)
  } catch (error) {
    console.error("GET /api/testimonials failed", error)
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await addTestimonial(body)

    // Revalidate cache for testimonials
    revalidateTag("testimonials", "default")

    return NextResponse.json(result)
  } catch (error) {
    console.error("POST /api/testimonials failed", error)
    return NextResponse.json({ error: "Failed to add testimonial" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, data } = body
    const result = await updateItem("TESTIMONIALS", id, data)

    // Revalidate cache for testimonials
    revalidateTag("testimonials", "default")

    return NextResponse.json(result)
  } catch (error) {
    console.error("PATCH /api/testimonials failed", error)
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 })
  }
}
