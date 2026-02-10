import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication using Next.js cookies
    const cookieStore = await cookies()
    const authCookie = cookieStore.get("admin_auth")
    const loginTimestamp = cookieStore.get("admin_login_time")

    if (!authCookie || !loginTimestamp || authCookie.value !== "true") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if session is still valid (within 1 hour)
    const loginTime = parseInt(loginTimestamp.value)
    const oneHour = 60 * 60 * 1000 // 1 hour in milliseconds

    if (Date.now() - loginTime >= oneHour) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      )
    }

    // Revalidate the sitemap
    revalidatePath("/sitemap.xml")

    return NextResponse.json({
      success: true,
      message: "Sitemap revalidated successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error revalidating sitemap:", error)
    return NextResponse.json(
      { error: "Failed to revalidate sitemap" },
      { status: 500 }
    )
  }
}
