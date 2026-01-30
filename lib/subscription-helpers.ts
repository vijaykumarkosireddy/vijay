import clientPromise from "./mongodb"

export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export interface StoredSubscription {
  _id?: string
  subscription: PushSubscription
  userId: string
  userAgent?: string
  createdAt: Date
  lastUsed?: Date
}

/**
 * Save a push subscription to the database
 */
export async function savePushSubscription(
  subscription: PushSubscription,
  userId: string = "admin",
  userAgent?: string
) {
  try {
    const client = await clientPromise
    const db = client.db("vijay_portfolio")
    const collection = db.collection<StoredSubscription>("push_subscriptions")

    // Check if subscription already exists
    const existing = await collection.findOne({
      "subscription.endpoint": subscription.endpoint,
    })

    if (existing) {
      // Update last used timestamp
      await collection.updateOne(
        { "subscription.endpoint": subscription.endpoint },
        { $set: { lastUsed: new Date() } }
      )
      return { success: true, existing: true }
    }

    // Insert new subscription
    await collection.insertOne({
      subscription,
      userId,
      userAgent,
      createdAt: new Date(),
      lastUsed: new Date(),
    })

    return { success: true, existing: false }
  } catch (error) {
    console.error("Error saving push subscription:", error)
    return { success: false, error }
  }
}

/**
 * Get all push subscriptions for a user
 */
export async function getPushSubscriptions(userId: string = "admin") {
  try {
    const client = await clientPromise
    const db = client.db("vijay_portfolio")
    const collection = db.collection<StoredSubscription>("push_subscriptions")

    const subscriptions = await collection.find({ userId }).toArray()

    return subscriptions
  } catch (error) {
    console.error("Error getting push subscriptions:", error)
    return []
  }
}

/**
 * Delete a push subscription
 */
export async function deletePushSubscription(endpoint: string) {
  try {
    const client = await clientPromise
    const db = client.db("vijay_portfolio")
    const collection = db.collection<StoredSubscription>("push_subscriptions")

    await collection.deleteOne({ "subscription.endpoint": endpoint })

    return { success: true }
  } catch (error) {
    console.error("Error deleting push subscription:", error)
    return { success: false, error }
  }
}

/**
 * Clean up expired/invalid subscriptions
 */
export async function cleanupPushSubscriptions() {
  try {
    const client = await clientPromise
    const db = client.db("vijay_portfolio")
    const collection = db.collection<StoredSubscription>("push_subscriptions")

    // Delete subscriptions not used in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await collection.deleteMany({
      lastUsed: { $lt: thirtyDaysAgo },
    })

    return { success: true, deletedCount: result.deletedCount }
  } catch (error) {
    console.error("Error cleaning up push subscriptions:", error)
    return { success: false, error }
  }
}
