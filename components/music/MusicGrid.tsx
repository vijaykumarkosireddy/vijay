import Link from "next/link"
import { Instagram, VideoOff } from "lucide-react"
import ShareButton from "@/components/shared/ShareButton"
async function getMusicItemsFromAPI(onlyFavorites = false) {
  // Build absolute URL for server-side fetching
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  const url = `${baseUrl}/api/music${onlyFavorites ? "?favorites=true" : ""}`

  const response = await fetch(url, {
    next: {
      tags: ["music"],
      revalidate: false, // Cache indefinitely until manually invalidated
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch music items")
  }

  return response.json()
}

export default async function MusicGrid() {
  const musicItems = await getMusicItemsFromAPI()

  return (
    <div className="grid gap-8 sm:gap-12 md:grid-cols-2">
      {musicItems.length > 0 ? (
        musicItems.map((item: any) => (
          <div
            key={item._id.toString()}
            className="group space-y-6 sm:space-y-8 animate-reveal-slow"
          >
            <div className="aspect-video relative overflow-hidden rounded-xl sm:rounded-2xl glass border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all group-hover:shadow-primary/10">
              <iframe
                className="absolute inset-0 h-full w-full border-0 transition-all duration-700 group-hover:opacity-100"
                src={item.url.replace("watch?v=", "embed/").split("&")[0]}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="flex items-start justify-between px-4 sm:px-6">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex gap-3 items-center">
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold truncate">
                    {item.platform}
                  </span>
                </div>
                <Link href={`/music/${item._id.toString()}`}>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter italic leading-tight line-clamp-2 hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                </Link>
              </div>
            </div>
            <div className="flex gap-3 ml-4 flex-shrink-0 items-center px-4 sm:px-6 pb-6">
              {item.instagramUrl && (
                <a
                  href={item.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full glass flex items-center justify-center hover:bg-primary transition-all group/icon"
                >
                  <Instagram className="h-4 w-4 sm:h-5 sm:w-5 group-hover/icon:text-primary-foreground" />
                </a>
              )}
              <ShareButton
                title={item.title}
                text={`Watch this performance by Vijay Kumar Kosireddy: ${item.title}`}
                url={`https://vijaykumarkosireddy.vercel.app/music/${item._id.toString()}`}
                className="h-10 w-10 sm:h-12 sm:w-12 bg-white/5 border border-white/10 text-white hover:bg-primary hover:text-primary-foreground"
              />
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full py-40 text-center space-y-4">
          <div className="h-16 w-16 rounded-full border border-border flex items-center justify-center mx-auto opacity-20">
            <VideoOff className="h-8 w-8 text-foreground" />
          </div>
          <p className="text-sm font-bold tracking-widest text-foreground/20 uppercase">
            Traditional recitals arriving soon
          </p>
        </div>
      )}
    </div>
  )
}
