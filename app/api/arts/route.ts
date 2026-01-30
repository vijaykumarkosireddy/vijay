import { NextResponse } from "next/server"
import { getArtItems, addArtItem, updateItem } from "@/lib/db-helpers"
import { revalidateTag } from "next/cache"
import { DB_CONFIG } from "@/constants/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const favorites = searchParams.get("favorites")

    const items = await getArtItems(favorites === "true")

    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("GET /api/arts failed", error)
    return NextResponse.json({ error: "Failed to fetch art items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await addArtItem(body)

    // Revalidate cache for arts
    revalidateTag("arts", "default")

    return NextResponse.json(result)
  } catch (error) {
    console.error("POST /api/arts failed", error)
    return NextResponse.json({ error: "Failed to add art item" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, data } = body
    const result = await updateItem("ARTS", id, data)

    // Revalidate cache for arts
    revalidateTag("arts", "default")

    return NextResponse.json(result)
  } catch (error) {
    console.error("PATCH /api/arts failed", error)
    return NextResponse.json({ error: "Failed to update art item" }, { status: 500 })
  }
}
