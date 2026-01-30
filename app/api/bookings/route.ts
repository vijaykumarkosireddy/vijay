import { NextResponse } from "next/server"
import { getBookings, addBooking } from "@/lib/db-helpers"
import { sendUserConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email-service"
import { getPushSubscriptions, StoredSubscription } from "@/lib/subscription-helpers"
import { sendPushNotification } from "@/lib/push-service"

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

    // Send emails and push notifications asynchronously (don't fail the booking if they fail)
    try {
      // Send confirmation email to user
      await sendUserConfirmationEmail(body)

      // Send notification email to admin
      await sendAdminNotificationEmail(body)

      // Send push notifications to all admin subscriptions
      const subscriptions = await getPushSubscriptions("admin")

      if (subscriptions.length > 0) {
        console.log(`📲 Sending push notifications to ${subscriptions.length} device(s)`)

        const pushPromises = subscriptions.map((sub: StoredSubscription) =>
          sendPushNotification(sub.subscription, {
            title: "🔔 New Inquiry Received",
            body: `${body.name} is interested in ${body.interest}`,
            icon: "/icon-192.png",
            url: "/admin#bookings",
          })
        )

        await Promise.allSettled(pushPromises)
      }
    } catch (notificationError) {
      // Log error but don't fail the booking
      console.error("Notification sending failed:", notificationError)
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit booking" }, { status: 500 })
  }
}
