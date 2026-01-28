import { getTestimonials } from "@/lib/db-helpers"
import Link from "next/link"
import TestimonialsCarousel from "@/components/shared/TestimonialsCarousel"

export default async function Testimonials() {
  const testimonials = await getTestimonials(true)

  if (testimonials.length === 0) return null

  // Serialize data for client component
  const serializedTestimonials = testimonials.map((item: any) => ({
    _id: item._id.toString(),
    name: item.name,
    role: item.role,
    text: item.text,
    imageUrl: item.imageUrl,
  }))

  return (
    <section className="py-24 md:py-40 px-6 md:px-12 bg-black overflow-hidden relative">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[radial-gradient(circle_at_center,theme(colors.primary)_0%,transparent_70%)] pointer-events-none" />

      <div className="mx-auto max-w-5xl relative z-10">
        <div className="mb-16 md:mb-24 text-center space-y-6">
          <div className="inline-block px-4 py-1 rounded-full border border-gold/20 glass-accent">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">
              Public Appreciation
            </span>
          </div>
          <h3 className="text-4xl md:text-6xl lg:text-7xl font-black italic tracking-tighter leading-none">
            Voices of <br />
            <span className="text-gold">Saraswathi</span>
          </h3>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-white/40 font-light leading-relaxed">
            A collection of feedback from students and patrons who have experienced the intersection
            of music and fine art.
          </p>
        </div>

        {/* Auto-Rotating Carousel */}
        <TestimonialsCarousel testimonials={serializedTestimonials} />

        {/* View All Link */}
        <div className="mt-12 text-center">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-3 px-8 py-4 glass rounded-full border-white/10 hover:border-gold/40 transition-all group text-[11px] font-black uppercase tracking-widest text-gold"
          >
            See the Archive
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
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
