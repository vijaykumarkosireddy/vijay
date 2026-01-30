import { NextResponse } from "next/server"
import { getMusicItems, addMusicItem, updateItem } from "@/lib/db-helpers"
import { revalidateTag } from "next/cache"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const favorites = searchParams.get("favorites")

    const items = await getMusicItems(favorites === "true")

    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("GET /api/music failed", error)
    return NextResponse.json({ error: "Failed to fetch music items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await addMusicItem(body)

    // Revalidate cache for music
    revalidateTag("music", "default")

    return NextResponse.json(result)
  } catch (error) {
    console.error("POST /api/music failed", error)
    return NextResponse.json({ error: "Failed to add music item" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, data } = body
    const result = await updateItem("MUSIC", id, data)

    // Revalidate cache for music
    revalidateTag("music", "default")

    return NextResponse.json(result)
  } catch (error) {
    console.error("PATCH /api/music failed", error)
    return NextResponse.json({ error: "Failed to update music item" }, { status: 500 })
  }
}
