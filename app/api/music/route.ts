import { NextResponse } from "next/server"
import { getMusicItems, addMusicItem, updateItem } from "@/lib/db-helpers"
import { revalidateTag } from "next/cache"
import { DB_CONFIG } from "@/constants/database"
import clientPromise from "@/lib/mongodb"
import { sendMusicNewsletterEmail } from "@/lib/email-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const favorites = searchParams.get("favorites")

    const items = await getMusicItems(favorites === "true")

    return NextResponse.json(items)
  } catch (error) {
    console.error("GET /api/music failed", error)
    return NextResponse.json({ error: "Failed to fetch music items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await addMusicItem(body)

    // Revalidate cache for music
    revalidateTag("music", "default")

    // Send newsletter emails asynchronously (don't fail the music creation if they fail)
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
          `🎵 Sending newsletter emails to ${subscribers.length} subscriber(s) for new music: ${body.title}`
        )

        const newsletterPromises = subscribers.map(async (subscriber: any) => {
          try {
            await sendMusicNewsletterEmail({
              email: subscriber.email,
              name: subscriber.name || "Music Lover",
              musicTitle: body.title,
              musicUrl: body.url || "",
              musicPlatform: body.platform || "Music",
              musicThumbnail: body.thumbnail || "",
            })
            console.log(`✅ Music newsletter sent to ${subscriber.email}`)
          } catch (error) {
            console.error(`❌ Failed to send music newsletter to ${subscriber.email}:`, error)
          }
        })

        await Promise.allSettled(newsletterPromises)
        console.log(`🎵 Music newsletter campaign completed for: ${body.title}`)
      }
    } catch (newsletterError) {
      // Log error but don't fail the music creation
      console.error("Music newsletter sending failed:", newsletterError)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("POST /api/music failed", error)
    return NextResponse.json({ error: "Failed to add music item" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, data } = body
    const result = await updateItem("MUSIC", id, data)

    // Revalidate cache for music
    revalidateTag("music", "default")

    return NextResponse.json(result)
  } catch (error) {
    console.error("PATCH /api/music failed", error)
    return NextResponse.json({ error: "Failed to update music item" }, { status: 500 })
  }
}
