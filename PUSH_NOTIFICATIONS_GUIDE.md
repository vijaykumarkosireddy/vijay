# Push Notifications Setup Guide

## Overview

Your portfolio now supports **Web Push Notifications** without needing external services like Firebase! The implementation uses the native Web Push API with the `web-push` npm package.

## How It Works

**Yes, you CAN implement push notifications without external backend services!** Here's how:

1. **VAPID Keys**: Uses Voluntary Application Server Identification (VAPID) keys for secure authentication
2. **Service Worker**: Handles push events in the background
3. **Subscription Management**: Stores user subscriptions in your MongoDB database
4. **Direct Sending**: Your Next.js API routes send notifications directly using the `web-push` library

## Setup Steps

### Step 1: Generate VAPID Keys

Run this command in your terminal:

```bash
npx web-push generate-vapid-keys
```

This will output something like:
```
Public Key: BNxw7jv...
Private Key: kKlm3n...
```

### Step 2: Add VAPID Keys to Environment

Add the generated keys to your `.env.local` file:

```bash
# Web Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-public-key-here
VAPID_PRIVATE_KEY=your-private-key-here
VAPID_SUBJECT=mailto:your-email@gmail.com
```

### Step 3: Create Subscription Management API

Create `/app/api/push/subscribe/route.ts`:

```typescript
import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const subscription = await request.json()
    
    // Store subscription in MongoDB
    const db = await getDb()
    await db.collection("push_subscriptions").insertOne({
      subscription,
      createdAt: new Date(),
      userId: "admin", // or user identifier
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
```

### Step 4: Request Permission in Browser

Create a client component to request push permission:

```typescript
"use client"

function requestNotificationPermission() {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    Notification.requestPermission().then(async (permission) => {
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        })

        // Send subscription to server
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subscription)
        })
      }
    })
  }
}
```

### Step 5: Send Notifications from Server

In your booking route or anywhere else:

```typescript
import { sendPushNotification } from "@/lib/push-service"
import { getDb } from "@/lib/mongodb"

// Get admin subscriptions from database
const db = await getDb()
const subscriptions = await db.collection("push_subscriptions")
  .find({ userId: "admin" })
  .toArray()

// Send notification to each subscription
for (const sub of subscriptions) {
  await sendPushNotification(sub.subscription, {
    title: "🔔 New Inquiry",
    body: `${name} is interested in ${interest}`,
    url: "/admin#bookings"
  })
}
```

## Current Status

✅ **Completed:**
- Service worker with push event handlers
- `web-push` library installed and configured
- Push service utility created (`/lib/push-service.ts`)
- Environment variables configured
- VAPID keys support added

⏳ **Phase 2 (To Implement):**
- Subscription management API routes
- Permission request UI component
- Database schema for storing subscriptions
- Integration with booking flow
- Admin dashboard to manage subscriptions

## Testing Push Notifications

Once fully implemented, test with:

1. Open your site in a browser
2. Look for "Install" button (PWA must be installed first)
3. Grant notification permission when prompted
4. Submit a test inquiry
5. Check for notification on your device

## Browser Support

✅ Chrome/Edge: Full support
✅ Firefox: Full support
✅ Safari (iOS 16.4+): Full support
⚠️ Older browsers: Graceful degradation

## Advantages Over External Services

1. **No Third-Party Dependency**: No Firebase or OneSignal needed
2. **Full Control**: You own the entire notification pipeline
3. **Cost**: Completely free, no usage limits
4. **Privacy**: User data stays on your server
5. **Simplicity**: No additional SDKs or complex setup

## Notes

- Push notifications require HTTPS (or localhost for development)
- The PWA must be installed for notifications to work on iOS
- Service worker must be registered successfully
- Users must grant notification permission explicitly

For the complete implementation of Phase 2, let me know and I can add:
- Subscription management UI
- Database integration
- Admin panel for managing subscriptions
- Automated notification triggers
