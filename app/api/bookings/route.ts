import { NextResponse } from "next/server"
import { getBookings, addBooking } from "@/lib/db-helpers"

export async function GET() {
  try {
    const items = await getBookings()
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await addBooking(body)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit booking" }, { status: 500 })
  }
}
