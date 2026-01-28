import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const envPassword = process.env.ADMIN_PASSWORD || "vijay_secret_access"

    if (password === envPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: "Invalid Credentials" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
