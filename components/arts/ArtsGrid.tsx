import Image from "next/image"
import Link from "next/link"
import { Instagram, ImageOff } from "lucide-react"
import ShareButton from "@/components/shared/ShareButton"

async function getArtItemsFromAPI(onlyFavorites = false) {
  // Build absolute URL for server-side fetching
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  const url = `${baseUrl}/api/arts${onlyFavorites ? "?favorites=true" : ""}`

  const response = await fetch(url, {
    next: {
      tags: ["arts"],
      revalidate: false, // Cache indefinitely until manually invalidated
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch art items")
  }

  return response.json()
}

export default async function ArtsGrid() {
  const artItems = await getArtItemsFromAPI()

  return (
    <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {artItems.length > 0 ? (
        artItems.map((item: any) => (
          <div key={item._id.toString()} className="group flex flex-col gap-6 animate-reveal-slow">
            <Link href={`/arts/${item._id.toString()}`} className="block relative aspect-[3/4] overflow-hidden rounded-[2.5rem] glass border-none gold-glow cursor-pointer">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background p-10 opacity-0 transition-opacity group-hover:opacity-100">
                {/* Stop propagation to prevent navigation when clicking links */}
                <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
                  {item.instagramUrl && (
                    <a
                      href={item.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                  <ShareButton
                    title={item.title}
                    text={`Check out this amazing sketch by Vijay Kumar Kosireddy: ${item.title}`}
                    url={`https://vijaykumarkosireddy.vercel.app/arts/${item._id.toString()}`}
                    className="h-12 w-12 bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
                  />
                </div>
              </div>
            </Link>
            <div className="px-4 space-y-1">
              <Link href={`/arts/${item._id.toString()}`} className="block hover:text-gold transition-colors">
                <h3 className="text-xl font-bold italic tracking-tighter capitalize">{item.title}</h3>
              </Link>
              <span className="text-xs font-bold uppercase tracking-widest text-gold opacity-60">
                Graphite on Paper
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full py-40 text-center space-y-4">
          <div className="h-16 w-16 rounded-full border border-border flex items-center justify-center mx-auto opacity-20">
            <ImageOff className="h-8 w-8 text-foreground" />
          </div>
          <p className="text-sm font-bold tracking-widest text-foreground/20 uppercase">
            The gallery is currently being curated
          </p>
        </div>
      )}
    </div>
  )
}
