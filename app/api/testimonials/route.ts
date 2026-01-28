import { NextResponse } from "next/server";
import { getTestimonials, addTestimonial } from "@/lib/db-helpers";

export async function GET() {
  try {
    const items = await getTestimonials();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await addTestimonial(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add testimonial" }, { status: 500 });
  }
}
