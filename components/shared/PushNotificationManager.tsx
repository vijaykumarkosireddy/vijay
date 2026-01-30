"use client"

import { useEffect, useState } from "react"

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission)
      checkSubscriptionStatus()
    }
  }, [])

  const checkSubscriptionStatus = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      } catch (error) {
        console.error("Error checking subscription:", error)
      }
    }
  }

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications")
      return
    }

    setIsLoading(true)

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission === "granted") {
        await subscribeToPush()
      }
    } catch (error) {
      console.error("Error requesting permission:", error)
      alert("Failed to request notification permission")
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToPush = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      alert("Push notifications are not supported")
      return
    }

    setIsLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready

      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        // Convert VAPID public key to Uint8Array
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidPublicKey) {
          throw new Error("VAPID public key not configured")
        }

        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

        // Subscribe to push notifications
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        })
      }

      // Send subscription to server
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
        }),
      })

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = "Failed to subscribe"

        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }

        throw new Error(errorMessage)
      }

      // Parse successful response
      const data = await response.json()

      if (data.success) {
        setIsSubscribed(true)
        alert("✅ Successfully subscribed to push notifications!")
      } else {
        throw new Error(data.error || "Failed to save subscription")
      }
    } catch (error) {
      console.error("Error subscribing to push:", error)
      alert("Failed to subscribe to push notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async () => {
    if (!("serviceWorker" in navigator)) return

    setIsLoading(true)

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()
        setIsSubscribed(false)
        alert("✅ Unsubscribed from push notifications")
      }
    } catch (error) {
      console.error("Error unsubscribing:", error)
      alert("Failed to unsubscribe")
    } finally {
      setIsLoading(false)
    }
  }

  if (!("Notification" in window)) {
    return null // Don't show on unsupported browsers
  }

  if (permission === "denied") {
    return (
      <div className="glass p-6 rounded-2xl border-red-500/20">
        <p className="text-sm text-red-400">
          ⚠️ Notifications are blocked. Please enable them in your browser settings.
        </p>
      </div>
    )
  }

  return (
    <div className="glass p-6 rounded-2xl border-primary/10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gold">Push Notifications</h3>
          <p className="text-sm text-foreground/60">
            Get notified when you receive new inquiries
          </p>
        </div>
        <div
          className={`h-3 w-3 rounded-full ${isSubscribed ? "bg-green-500" : "bg-gray-500"} animate-pulse`}
        />
      </div>

      {!isSubscribed ? (
        <button
          onClick={permission === "granted" ? subscribeToPush : requestPermission}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-primary text-black font-bold text-sm uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Setting up..." : "Enable Notifications"}
        </button>
      ) : (
        <button
          onClick={unsubscribe}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Disable Notifications"}
        </button>
      )}

      <p className="text-xs text-foreground/40 text-center">
        {isSubscribed ? "You'll receive push notifications" : "Click to enable notifications"}
      </p>
    </div>
  )
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
