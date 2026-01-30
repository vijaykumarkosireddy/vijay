import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getPushSubscriptions, deletePushSubscription } from "@/lib/subscription-helpers"
import { validateAdminToken } from "@/lib/admin-token"

async function validateAdmin() {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get("admin_token")?.value
  const adminAuth = cookieStore.get("admin_auth")?.value

  return adminAuth === "true" && validateAdminToken(adminToken)
}

export async function GET() {
  try {
    // SECURITY: Validate admin authentication
    if (!(await validateAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subscriptions = await getPushSubscriptions("admin")
    return NextResponse.json({ subscriptions })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // SECURITY: Validate admin authentication
    if (!(await validateAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const endpoint = searchParams.get("endpoint")

    if (!endpoint) {
      return NextResponse.json({ error: "Endpoint required" }, { status: 400 })
    }

    const result = await deletePushSubscription(endpoint)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to delete subscription" }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
