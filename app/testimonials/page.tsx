import TestimonialsHero from "@/components/testimonials/TestimonialsHero"
import TestimonialsGrid from "@/components/testimonials/TestimonialsGrid"

export const dynamic = "force-dynamic"

export default async function FullTestimonialsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 md:py-40">
      <TestimonialsHero />
      <TestimonialsGrid />
    </div>
  )
}
