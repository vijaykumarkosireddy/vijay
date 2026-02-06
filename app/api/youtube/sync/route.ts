import { NextResponse } from "next/server"
import { addMusicItem, getMusicItems } from "@/lib/db-helpers"
import { DB_CONFIG } from "@/constants/database"
import clientPromise from "@/lib/mongodb"
import { sendMusicNewsletterEmail } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

    if (!API_KEY || !CHANNEL_ID) {
      return NextResponse.json({
        success: false,
        error: "YouTube API Key or Channel ID missing. Using manual database entries only.",
        added: 0,
      })
    }

    // Fetch last 10 videos from channel
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10&type=video`
    )

    if (!res.ok) {
      const errorData = await res.json()
      return NextResponse.json({
        success: false,
        error: "YouTube API Error. Falling back to manual entries.",
        details: errorData,
      })
    }

    const data = await res.json()

    const currentMusic = await getMusicItems()
    const existingUrls = new Set(currentMusic.map((m: any) => m.url))

    let addedCount = 0
    const newVideos: any[] = []

    for (const item of data.items) {
      const videoUrl = `https://www.youtube.com/watch?v=${item.id.videoId}`
      if (!existingUrls.has(videoUrl)) {
        const videoData = {
          title: item.snippet.title,
          url: videoUrl,
          platform: "YouTube Sync",
          thumbnail: item.snippet.thumbnails.high.url,
          isFavorite: false,
        }

        await addMusicItem(videoData)
        newVideos.push(videoData)
        addedCount++
      }
    }

    // Send newsletter emails for new videos asynchronously (don't fail the sync if they fail)
    if (newVideos.length > 0) {
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
            `🎵 Sending newsletter emails to ${subscribers.length} subscriber(s) for ${newVideos.length} new YouTube videos`
          )

          for (const video of newVideos) {
            const newsletterPromises = subscribers.map(async (subscriber: any) => {
              try {
                await sendMusicNewsletterEmail({
                  email: subscriber.email,
                  name: subscriber.name || "Music Lover",
                  musicTitle: video.title,
                  musicUrl: video.url,
                  musicPlatform: video.platform,
                  musicThumbnail: video.thumbnail,
                })
                console.log(`✅ YouTube newsletter sent to ${subscriber.email} for: ${video.title}`)
              } catch (error) {
                console.error(`❌ Failed to send YouTube newsletter to ${subscriber.email}:`, error)
              }
            })

            await Promise.allSettled(newsletterPromises)
            console.log(`🎵 YouTube newsletter campaign completed for: ${video.title}`)
          }
        }
      } catch (newsletterError) {
        // Log error but don't fail the sync
        console.error("YouTube newsletter sending failed:", newsletterError)
      }
    }

    return NextResponse.json({ success: true, added: addedCount })
  } catch (error) {
    console.error("YouTube Sync Error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
