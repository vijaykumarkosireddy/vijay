import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getMusicItem } from "@/lib/db-helpers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate ObjectId format
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid music item ID" },
        { status: 400 }
      )
    }

    const item = await getMusicItem(id)

    if (!item) {
      return NextResponse.json(
        { error: "Music item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching music item:", error)
    return NextResponse.json(
      { error: "Failed to fetch music item" },
      { status: 500 }
    )
  }
}
