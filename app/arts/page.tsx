import { getArtItems } from "@/lib/db-helpers"
import Image from "next/image"
import { SITE_CONTENT } from "@/constants/content"

export const dynamic = "force-dynamic"

export default async function ArtsPage() {
  const artItems = await getArtItems()

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-12">
      <div className="mb-24 flex flex-col items-center text-center space-y-6 animate-reveal">
        <h1 className="text-5xl font-bold tracking-tighter md:text-7xl title-reveal">
          Fine Art Portfolio
        </h1>
        <p className="max-w-2xl text-lg text-foreground/60 font-light">
          Experience the depth of graphite realism. Each piece is a testament to the discipline of
          observation and the soul of art.
        </p>
      </div>

      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {artItems.length > 0 ? (
          artItems.map((item: any) => (
            <div
              key={item._id.toString()}
              className="group flex flex-col gap-6 animate-reveal-slow"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] glass border-none gold-glow">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-all duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background p-10 opacity-0 transition-opacity group-hover:opacity-100">
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
                <h3 className="text-xl font-bold italic tracking-tighter">{item.title}</h3>
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

      {/* Secondary Bio Section on Arts Page */}
      <div className="mt-40 grid gap-16 lg:grid-cols-2 items-center glass p-12 rounded-[3rem] border-accent/5">
        <div className="relative h-[500px] overflow-hidden rounded-[2.5rem]">
          <Image
            src={SITE_CONTENT.BIO.SECONDARY_IMAGE}
            alt="Vijay Artist"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-8">
          <h2 className="text-4xl font-bold tracking-tighter italic gold-glow inline-block px-4 py-2 bg-primary/10 rounded-xl">
            The Artist Behind the Pencil
          </h2>
          <p className="text-xl text-foreground/70 font-light leading-relaxed">
            {SITE_CONTENT.BIO.EXTENDED}
          </p>
        </div>
      </div>
    </div>
  )
}
