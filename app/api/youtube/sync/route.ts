import { NextResponse } from "next/server";
import { addMusicItem, getMusicItems } from "@/lib/db-helpers";

export async function POST(request: Request) {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    if (!API_KEY || !CHANNEL_ID) {
      return NextResponse.json({
        success: false,
        error: "YouTube API Key or Channel ID missing. Using manual database entries only.",
        added: 0
      });
    }

    // Fetch last 10 videos from channel
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10&type=video`
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({
        success: false,
        error: "YouTube API Error. Falling back to manual entries.",
        details: errorData
      });
    }

    const data = await res.json();

    const currentMusic = await getMusicItems();
    const existingUrls = new Set(currentMusic.map((m: any) => m.url));

    let addedCount = 0;
    for (const item of data.items) {
      const videoUrl = `https://www.youtube.com/watch?v=${item.id.videoId}`;
      if (!existingUrls.has(videoUrl)) {
        await addMusicItem({
          title: item.snippet.title,
          url: videoUrl,
          platform: "YouTube Sync",
          thumbnail: item.snippet.thumbnails.high.url,
          isFavorite: false
        });
        addedCount++;
      }
    }

    return NextResponse.json({ success: true, added: addedCount });
  } catch (error) {
    console.error("YouTube Sync Error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
