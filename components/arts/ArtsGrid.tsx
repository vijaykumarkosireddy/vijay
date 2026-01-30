import Image from "next/image"

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
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] glass border-none gold-glow">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-all duration-1000"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background p-10 opacity-0 transition-opacity">
                {item.instagramUrl && (
                  <a
                    href={item.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </a>
                )}
              </div>
            </div>
            <div className="px-4 space-y-1">
              <h3 className="text-xl font-bold italic tracking-tighter capitalize">{item.title}</h3>
              <span className="text-xs font-bold uppercase tracking-widest text-gold opacity-60">
                Graphite on Paper
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full py-40 text-center space-y-4">
          <div className="h-16 w-16 rounded-full border border-border flex items-center justify-center mx-auto opacity-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              <circle cx="9" cy="9" r="2"></circle>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
          </div>
          <p className="text-sm font-bold tracking-widest text-foreground/20 uppercase">
            The gallery is currently being curated
          </p>
        </div>
      )}
    </div>
  )
}
