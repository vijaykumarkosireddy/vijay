import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { savePushSubscription } from "@/lib/subscription-helpers"
import { validateAdminToken } from "@/lib/admin-token"

export async function POST(request: Request) {
  try {
    // SECURITY: Validate admin token from cookie
    const cookieStore = await cookies()
    const adminToken = cookieStore.get("admin_token")?.value
    const adminAuth = cookieStore.get("admin_auth")?.value

    console.log("Push subscribe attempt:", {
      hasAdminAuth: !!adminAuth,
      hasAdminToken: !!adminToken,
      adminAuthValue: adminAuth,
    })

    // Check if user is authenticated admin with valid token
    if (!adminAuth || adminAuth !== "true" || !validateAdminToken(adminToken)) {
      console.log("Push subscribe rejected: Invalid authentication")
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { subscription, userAgent } = body

    if (!subscription || !subscription.endpoint) {
      console.log("Push subscribe rejected: Invalid subscription object")
      return NextResponse.json(
        { success: false, error: "Invalid subscription object" },
        { status: 400 }
      )
    }

    // Save subscription to database (default to admin user)
    const result = await savePushSubscription(subscription, "admin", userAgent)

    if (result.success) {
      console.log("Push subscription saved successfully")
      return NextResponse.json({
        success: true,
        message: result.existing
          ? "Subscription already exists"
          : "Subscription saved successfully",
      })
    } else {
      console.error("Failed to save subscription:", result.error)
      return NextResponse.json(
        { success: false, error: "Failed to save subscription" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Subscription error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process subscription" },
      { status: 500 }
    )
  }
}
