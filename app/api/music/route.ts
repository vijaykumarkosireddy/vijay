import { NextResponse } from "next/server";
import { getMusicItems, addMusicItem } from "@/lib/db-helpers";

export async function GET() {
  try {
    const items = await getMusicItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch music items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await addMusicItem(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add music item" }, { status: 500 });
  }
}
