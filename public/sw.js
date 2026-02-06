// Service Worker for PWA - Push notifications only, NO CACHING
const CACHE_VERSION = "v3"

// Install event - just skip waiting
self.addEventListener("install", event => {
  console.log(`[SW] Installing version ${CACHE_VERSION}`)
  self.skipWaiting()
})

// Fetch event - ALWAYS go to network, never cache
self.addEventListener("fetch", event => {
  // Always fetch from network, don't cache anything
  event.respondWith(fetch(event.request))
})

// Activate event - clean up ALL old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log(`[SW] Deleting old cache: ${cacheName}`)
            return caches.delete(cacheName)
          })
        )
      })
      .then(() => {
        console.log(`[SW] Activated - all caches cleared`)
      })
  )
  self.clients.claim()
})

// Listen for skip waiting message from client
self.addEventListener("message", event => {
  if (event.data === "skipWaiting") {
    self.skipWaiting()
  }
})

// Push notification event handler
self.addEventListener("push", event => {
  let data = {
    title: "🔔 Portfolio Update",
    body: "You have a new notification",
  }

  // Parse the push notification data
  if (event.data) {
    try {
      data = event.data.json()
    } catch (e) {
      // Fallback to text if JSON parsing fails
      data.body = event.data.text()
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [200, 100, 200],
    tag: "portfolio-notification",
    requireInteraction: false,
    data: {
      dateOfArrival: Date.now(),
      url: data.url || "/",
    },
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Notification click event handler
self.addEventListener("notificationclick", event => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || "/"

  event.waitUntil(clients.openWindow(urlToOpen))
})
