import { NextResponse } from "next/server"
import { getArtItems, addArtItem, updateItem } from "@/lib/db-helpers"
import { revalidateTag } from "next/cache"
import { DB_CONFIG } from "@/constants/database"
import clientPromise from "@/lib/mongodb"
import { sendNewsletterEmail } from "@/lib/email-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const favorites = searchParams.get("favorites")

    const items = await getArtItems(favorites === "true")

    return NextResponse.json(items)
  } catch (error) {
    console.error("GET /api/arts failed", error)
    return NextResponse.json({ error: "Failed to fetch art items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await addArtItem(body)

    // Revalidate cache for arts
    revalidateTag("arts", "default")

    // Send newsletter emails asynchronously (don't fail the art creation if they fail)
    try {
      const client = await clientPromise
      const db = client.db(DB_CONFIG.NAME)

      // Get all active newsletter subscribers
      const subscribers = await db
        .collection(DB_CONFIG.COLLECTIONS.NEWSLETTER_SUBSCRIBERS)
        .find({ active: true })
        .toArray()

      if (subscribers.length > 0) {
        console.log(
          `📧 Sending newsletter emails to ${subscribers.length} subscriber(s) for new art: ${body.title}`
        )

        const newsletterPromises = subscribers.map(async (subscriber: any) => {
          try {
            await sendNewsletterEmail({
              email: subscriber.email,
              name: subscriber.name || "Art Enthusiast",
              artTitle: body.title,
              artDescription: body.description || "",
              artCategory: body.category || "Art",
              artImageUrl: body.imageUrl || "",
            })
            console.log(`✅ Newsletter sent to ${subscriber.email}`)
          } catch (error) {
            console.error(`❌ Failed to send newsletter to ${subscriber.email}:`, error)
          }
        })

        await Promise.allSettled(newsletterPromises)
        console.log(`🎨 Newsletter campaign completed for new art: ${body.title}`)
      }
    } catch (newsletterError) {
      // Log error but don't fail the art creation
      console.error("Newsletter sending failed:", newsletterError)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("POST /api/arts failed", error)
    return NextResponse.json({ error: "Failed to add art item" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, data } = body
    const result = await updateItem("ARTS", id, data)

    // Revalidate cache for arts
    revalidateTag("arts", "default")

    return NextResponse.json(result)
  } catch (error) {
    console.error("PATCH /api/arts failed", error)
    return NextResponse.json({ error: "Failed to update art item" }, { status: 500 })
  }
}
