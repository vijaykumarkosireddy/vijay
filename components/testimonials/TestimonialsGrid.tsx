import Image from "next/image"

async function getTestimonialsFromAPI(onlyFavorites = false) {
  // Build absolute URL for server-side fetching
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  const url = `${baseUrl}/api/testimonials${onlyFavorites ? "?favorites=true" : ""}`

  const response = await fetch(url, {
    next: {
      tags: ["testimonials"],
      revalidate: false, // Cache indefinitely until manually invalidated
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch testimonials")
  }

  return response.json()
}

export default async function TestimonialsGrid() {
  const testimonials = await getTestimonialsFromAPI()

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.length > 0 ? (
        testimonials.map((t: any) => (
          <div
            key={t._id.toString()}
            className="group relative flex flex-col justify-between animate-reveal-slow p-10 rounded-[2.5rem] glass border-white/5 hover:border-gold/20 transition-all bg-white/[0.01]"
          >
            <div className="space-y-8">
              <div className="h-10 w-10 opacity-20 text-gold flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 7.34315 11.3601 6 13.017 6H19.017C20.6739 6 22.017 7.34315 22.017 9V15C22.017 16.6569 20.6739 18 19.017 18H17.017C16.4647 18 16.017 18.4477 16.017 19V21H14.017ZM3.01697 21L3.01697 18C3.01697 16.8954 3.91241 16 5.01697 16H8.01697C8.56926 16 9.01697 15.5523 9.01697 15V9C9.01697 8.44772 8.56926 8 8.01697 8H4.01697C3.46468 8 3.01697 8.44772 3.01697 9V12C3.01697 12.5523 2.56925 13 2.01697 13H0.0169678C-0.535317 13 -0.983032 12.5523 -0.983032 12V9C-0.983032 7.34315 0.360114 6 2.01697 6H8.01697C9.67382 6 11.017 7.34315 11.017 9V15C11.017 16.6569 9.67382 18 8.01697 18H6.01697C5.46468 18 5.01697 18.4477 5.01697 19V21H3.01697Z" />
                </svg>
              </div>
              <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed italic min-h-[3rem] flex items-center">
                "{t.text}"
              </p>
            </div>

            <div className="mt-12 flex items-center gap-5 pt-8 border-t border-white/5">
              {t.imageUrl ? (
                <div className="h-14 w-14 rounded-2xl overflow-hidden border border-white/10 relative bg-black/40 shadow-xl group-hover:border-gold/30 transition-all">
                  <Image src={t.imageUrl} alt={t.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-14 w-14 rounded-2xl border border-gold/20 bg-gold/10 flex items-center justify-center shadow-xl group-hover:bg-gold/20 transition-all">
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
                    className="text-gold"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-black text-sm uppercase tracking-widest text-gold italic">
                  {t.name}
                </h4>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-1">
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full py-60 text-center opacity-10 uppercase tracking-[0.8em] font-black italic text-4xl select-none">
          Voices Awaited.
        </div>
      )}
    </div>
  )
}
