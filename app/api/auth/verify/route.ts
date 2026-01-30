import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const auth = cookieStore.get("admin_auth")
    const loginTimestamp = cookieStore.get("admin_login_time")

    if (!auth || !loginTimestamp || auth.value !== "true") {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const loginTime = parseInt(loginTimestamp.value)
    const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds

    if (Date.now() - loginTime >= oneHour) {
      // Session expired
      return NextResponse.json({ authenticated: false, reason: "expired" }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
