import Image from "next/image"
import Link from "next/link"
import { ImageOff } from "lucide-react"
import ArtCardActions from "./ArtCardActions"

export default async function ArtsGrid() {
  let artItems = []

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/arts`, {
      cache: 'no-store'
    })

    if (response.ok) {
      artItems = await response.json()
    }
  } catch (error) {
    console.error("Error fetching art items:", error)
  }

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
                <ArtCardActions item={item} />
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
