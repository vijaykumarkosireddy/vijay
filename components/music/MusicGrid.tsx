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
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter italic leading-tight line-clamp-2">
                  {item.title}
                </h3>
              </div>
              {item.instagramUrl && (
                <a
                  href={item.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full glass flex items-center justify-center hover:bg-primary transition-all group/icon flex-shrink-0 ml-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover/icon:text-primary-foreground"
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
              <path d="m22 8-6 4 6 4V8Z"></path>
              <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
            </svg>
          </div>
          <p className="text-sm font-bold tracking-widest text-foreground/20 uppercase">
            Traditional recitals arriving soon
          </p>
        </div>
      )}
    </div>
  )
}
