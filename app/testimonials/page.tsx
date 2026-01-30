import TestimonialsHero from "@/components/testimonials/TestimonialsHero"
import TestimonialsGrid from "@/components/testimonials/TestimonialsGrid"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Testimonials | Vijay Kumar Kosireddy - Client Reviews & Feedback",
  description: "Read testimonials and reviews from students, clients, and art enthusiasts about Vijay Kumar Kosireddy's music teaching and pencil sketch artistry. Discover what people are saying.",
  keywords: [
    "Testimonials",
    "Client Reviews",
    "Student Feedback",
    "Music Teacher Reviews",
    "Artist Testimonials",
    "Carnatic Music Teacher Reviews",
  ],
  openGraph: {
    title: "Testimonials | Vijay Kumar Kosireddy",
    description: "Read what students and clients say about Vijay Kumar Kosireddy",
    url: "https://vijaykumarkosireddy.vercel.app/testimonials",
    type: "website",
  },
}

export const dynamic = "force-dynamic"

export default async function FullTestimonialsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 md:py-40">
      <TestimonialsHero />
      <TestimonialsGrid />
    </div>
  )
}
