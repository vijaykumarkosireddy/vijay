import { NextResponse } from "next/server";
import { toggleFavorite, deleteItem } from "@/lib/db-helpers";
import { DB_CONFIG } from "@/constants/database";

export async function PATCH(request: Request) {
  try {
    const { collection, id, status } = await request.json();
    const result = await toggleFavorite(collection as keyof typeof DB_CONFIG.COLLECTIONS, id, status);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle favorite" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection");
    const id = searchParams.get("id");

    if (!collection || !id) {
      return NextResponse.json({ error: "Missing collection or id" }, { status: 400 });
    }

    const result = await deleteItem(collection as keyof typeof DB_CONFIG.COLLECTIONS, id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
