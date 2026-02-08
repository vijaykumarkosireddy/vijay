import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { DB_CONFIG } from "@/constants/database"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(DB_CONFIG.NAME)

    // Fetch favorite blogs that are published and not drafts, limit to 4
    const blogs = await db
      .collection(DB_CONFIG.COLLECTIONS.BLOGS)
      .find({
        published: true,
        isDraft: false,
        isFavorite: true,
      })
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray()

    return NextResponse.json({ data: blogs })
  } catch (error) {
    console.error("Error fetching featured blogs:", error)
    return NextResponse.json({ error: "Failed to fetch featured blogs" }, { status: 500 })
  }
}
