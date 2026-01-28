import { getMusicItems } from "@/lib/db-helpers"
import { SITE_CONTENT } from "@/constants/content"

export const dynamic = "force-dynamic"

export default async function MusicPage() {
  const musicItems = await getMusicItems()

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-12">
      <div className="mb-24 flex flex-col items-center text-center space-y-6 animate-reveal">
        <h1 className="text-5xl font-bold tracking-tighter md:text-7xl title-reveal">
          {SITE_CONTENT.SCHOOL_NAME}
        </h1>
        <p className="max-w-3xl text-lg text-foreground/60 font-light">
          Dedicated to the preservation and teaching of Carnatic Vocal music. Discover performances
          and educational sessions led by {SITE_CONTENT.NAME}.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        {musicItems.length > 0 ? (
          musicItems.map((item: any) => (
            <div key={item._id.toString()} className="group space-y-8 animate-reveal-slow">
              <div className="aspect-video relative overflow-hidden rounded-[2.5rem] glass border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all group-hover:shadow-primary/10">
                <iframe
                  className="absolute inset-0 h-full w-full border-0 grayscale opacity-60 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100"
                  src={item.url.replace("watch?v=", "embed/").split("&")[0]}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="flex items-start justify-between px-6">
                <div className="space-y-2">
                  <div className="flex gap-3 items-center">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                      {item.platform}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tighter italic">{item.title}</h3>
                </div>
                {item.instagramUrl && (
                  <a
                    href={item.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 w-12 rounded-full glass flex items-center justify-center hover:bg-primary transition-all group/icon"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover/icon:text-primary-foreground"
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
    </div>
  )
}
