import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getArtItem } from "@/lib/db-helpers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate ObjectId format
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid art item ID" },
        { status: 400 }
      )
    }

    const item = await getArtItem(id)

    if (!item) {
      return NextResponse.json(
        { error: "Art item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching art item:", error)
    return NextResponse.json(
      { error: "Failed to fetch art item" },
      { status: 500 }
    )
  }
}
