import { NextResponse } from "next/server"
import { generateAdminToken } from "@/lib/admin-token"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const envPassword = process.env.ADMIN_PASSWORD || "vijay_secret_access"

    if (password === envPassword) {
      // Generate new admin token (rotates on each login)
      const adminToken = generateAdminToken()

      const response = NextResponse.json({ success: true })

      // Set admin auth cookie
      response.cookies.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      })

      // Set admin token cookie (for push notification authorization)
      response.cookies.set("admin_token", adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      })

      // Set login timestamp
      response.cookies.set("admin_login_time", Date.now().toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60,
        path: "/",
      })

      return response
    } else {
      return NextResponse.json({ success: false, error: "Invalid Credentials" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
