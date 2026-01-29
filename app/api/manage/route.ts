import { NextResponse } from "next/server"
import { toggleFavorite, deleteItem, updateItem } from "@/lib/db-helpers"
import { DB_CONFIG } from "@/constants/database"
import { revalidateTag } from "next/cache"

export async function PATCH(request: Request) {
  try {
    const body = await request.json()

    // Handle different PATCH operations
    if (body.status !== undefined) {
      // Toggle favorite operation
      const { collection, id, status } = body
      const result = await toggleFavorite(
        collection as keyof typeof DB_CONFIG.COLLECTIONS,
        id,
        status
      )

      // Revalidate cache for the specific collection
      revalidateTag(collection.toLowerCase(), "default")

      return NextResponse.json(result)
    } else if (body.data) {
      // Update item operation
      const { collection, id, data } = body
      const result = await updateItem(collection as keyof typeof DB_CONFIG.COLLECTIONS, id, data)

      // Revalidate cache for the specific collection
      revalidateTag(collection.toLowerCase(), "default")

      return NextResponse.json(result)
    } else {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const collection = searchParams.get("collection")
    const id = searchParams.get("id")

    if (!collection || !id) {
      return NextResponse.json({ error: "Missing collection or id" }, { status: 400 })
    }

    const result = await deleteItem(collection as keyof typeof DB_CONFIG.COLLECTIONS, id)

    // Revalidate cache for the specific collection
    revalidateTag(collection.toLowerCase(), "default")

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
