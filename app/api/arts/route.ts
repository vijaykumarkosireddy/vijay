import { NextResponse } from "next/server"
import { getArtItems, addArtItem } from "@/lib/db-helpers"

export async function GET() {
  try {
    const items = await getArtItems()
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch art items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await addArtItem(body)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add art item" }, { status: 500 })
  }
}
