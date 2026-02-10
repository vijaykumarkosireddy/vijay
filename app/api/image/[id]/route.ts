import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { DB_CONFIG } from "@/constants/database"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "jpeg"

    const client = await clientPromise
    const db = client.db(DB_CONFIG.NAME)

    const imageDoc = await db.collection("uploads").findOne({ _id: new ObjectId(id) })

    if (!imageDoc) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    // Determine which data to serve
    let base64Data: string
    let mimeType: string

    if (format === "webp" && imageDoc.webpData) {
      base64Data = imageDoc.webpData
      mimeType = "image/webp"
    } else if (format === "blur" && imageDoc.blurData) {
      base64Data = imageDoc.blurData
      mimeType = "image/jpeg"
    } else if (imageDoc.jpegData) {
      base64Data = imageDoc.jpegData
      mimeType = "image/jpeg"
    } else {
      base64Data = imageDoc.data
      mimeType = imageDoc.mimeType || "application/octet-stream"
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, "base64")

    // Return image with proper headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Image retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve image" }, { status: 500 })
  }
}
