import Link from "next/link"
import { SITE_CONTENT } from "@/constants/content"
import { ROUTES } from "@/constants/navigation"

async function getMusicItemsFromAPI(onlyFavorites = false) {
  // Build absolute URL for server-side fetching
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  const url = `${baseUrl}/api/music${onlyFavorites ? "?favorites=true" : ""}`

  const response = await fetch(url, {
    next: {
      tags: ["music"],
      revalidate: 3600 * 48, // 48 hours
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch music items")
  }

  return response.json()
}

export default async function MusicSection() {
  const musicItems = await getMusicItemsFromAPI(true) // Fetch favorites only

  // Limit to maximum 4 items for landing page
  const displayItems = musicItems.slice(0, 4)

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 md:mb-20 grid gap-8 lg:grid-cols-2 lg:items-end">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="h-[1px] w-12 bg-primary animate-draw" />
              <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-gold">
                Carnatic Tradition
              </h2>
            </div>
            <h3 className="text-4xl font-bold tracking-tighter md:text-6xl">
              {SITE_CONTENT.SCHOOL_NAME}
            </h3>
          </div>
          <div className="flex lg:justify-end">
            <Link
              href={ROUTES.find(r => r.label === "Music")?.path || "/music"}
              className="text-sm font-bold text-foreground/50 transition-colors hover:text-gold flex items-center gap-2"
            >
              VIEW PERFORMANCES{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.length > 0
            ? displayItems.map((item: any) => (
              <div
                key={item._id.toString()}
                className="group relative overflow-hidden rounded-[2rem] glass-accent p-2 transition-all hover:-translate-y-2"
              >
                <div className="aspect-[4/3] rounded-[1.8rem] bg-muted/30 overflow-hidden relative">
                  <iframe
                    className="absolute inset-0 h-full w-full border-0  transition-all duration-700"
                    src={item.url.replace("watch?v=", "embed/").split("&")[0]}
                    title={item.title}
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-primary/10 px-3 py-1 rounded-full">
                      {item.platform}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold group-hover:text-gold transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))
            : /* Show static placeholders if no favorites */
            [1, 2, 3].map(i => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-[2rem] glass-accent p-2 opacity-20"
              >
                <div className="aspect-[4/3] rounded-[1.8rem] bg-black" />
                <div className="p-8 space-y-4">
                  <div className="h-4 w-1/4 bg-primary/10 rounded" />
                  <div className="h-6 w-3/4 bg-primary/5 rounded" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
