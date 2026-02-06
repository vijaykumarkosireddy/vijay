import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { DB_CONFIG } from "@/constants/database"
import { ObjectId } from "mongodb"

// GET - Fetch all newsletter subscribers (admin only)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get("active")

    const client = await clientPromise
    const db = client.db(DB_CONFIG.NAME)

    const query: any = {}
    if (active !== null) {
      query.active = active === "true"
    }

    const subscribers = await db
      .collection(DB_CONFIG.COLLECTIONS.NEWSLETTER_SUBSCRIBERS)
      .find(query)
      .sort({ subscribedAt: -1 })
      .toArray()

    return NextResponse.json(subscribers)
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error)
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 })
  }
}

// POST - Subscribe to newsletter
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name = "" } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(DB_CONFIG.NAME)

    // Check if email already exists
    const existing = await db
      .collection(DB_CONFIG.COLLECTIONS.NEWSLETTER_SUBSCRIBERS)
      .findOne({ email: email.toLowerCase() })

    if (existing) {
      if (existing.active) {
        // Update name if provided and different from existing
        if (name && name.trim() && existing.name !== name.trim()) {
          await db.collection(DB_CONFIG.COLLECTIONS.NEWSLETTER_SUBSCRIBERS).updateOne(
            { email: email.toLowerCase() },
            {
              $set: {
                name: name.trim(),
                updatedAt: new Date(),
                lastSource: "newsletter_subscription",
              },
            }
          )
          return NextResponse.json({
            success: true,
            message: "Email already subscribed. Name updated successfully!",
          })
        }
        return NextResponse.json(
          {
            error: "Email already subscribed",
            existingName: existing.name,
          },
          { status: 409 }
        )
      } else {
        // Reactivate subscription and update name
        await db.collection(DB_CONFIG.COLLECTIONS.NEWSLETTER_SUBSCRIBERS).updateOne(
          { email: email.toLowerCase() },
          {
            $set: {
              active: true,
              name: name.trim() || existing.name,
              updatedAt: new Date(),
              lastSource: "newsletter_subscription",
            },
          }
        )
        return NextResponse.json({
          success: true,
          message: "Subscription reactivated successfully!",
        })
      }
    }

    // Create new subscription
    await db.collection(DB_CONFIG.COLLECTIONS.NEWSLETTER_SUBSCRIBERS).insertOne({
      email: email.toLowerCase(),
      name: name.trim(),
      active: true,
      subscribedAt: new Date(),
      updatedAt: new Date(),
      lastSource: "newsletter_subscription",
    })

    return NextResponse.json({ success: true, message: "Subscribed successfully" })
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}

// DELETE - Unsubscribe from newsletter
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(DB_CONFIG.NAME)

    const result = await db
      .collection(DB_CONFIG.COLLECTIONS.NEWSLETTER_SUBSCRIBERS)
      .updateOne({ email: email.toLowerCase() }, { $set: { active: false, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Unsubscribed successfully" })
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error)
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
  }
}
