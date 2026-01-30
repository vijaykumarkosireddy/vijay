import webpush from "web-push"

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || ""
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@example.com"

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
}

export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

/**
 * Send a push notification to a subscribed user
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  payload: {
    title: string
    body: string
    icon?: string
    url?: string
  }
) {
  try {
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || "/icon-192.png",
      url: payload.url || "/",
    })

    await webpush.sendNotification(subscription, notificationPayload)
    console.log("✅ Push notification sent successfully")
    return { success: true }
  } catch (error: any) {
    console.error("❌ Error sending push notification:", error)

    // Check if subscription has expired (410 Gone)
    if (error.statusCode === 410) {
      return {
        success: false,
        error,
        statusCode: 410,
        expired: true
      }
    }

    return { success: false, error }
  }
}

/**
 * Send push notification to admin when new inquiry is received
 */
export async function notifyAdminOfNewInquiry(
  subscription: PushSubscription,
  data: {
    name: string
    interest: string
  }
) {
  return sendPushNotification(subscription, {
    title: "🔔 New Inquiry Received",
    body: `${data.name} is interested in ${data.interest}`,
    icon: "/icon-192.png",
    url: "/admin#bookings",
  })
}
