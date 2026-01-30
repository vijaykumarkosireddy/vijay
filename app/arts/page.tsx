import ArtsHero from "@/components/arts/ArtsHero"
import ArtsGrid from "@/components/arts/ArtsGrid"
import ArtsBio from "@/components/arts/ArtsBio"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Art Gallery | Vijay Kumar Kosireddy - Mono-Realistic Pencil Sketches",
  description: "Discover stunning mono-realistic pencil sketches and graphite portraits by Vijay Kumar Kosireddy. Professional artist specializing in detailed realistic pencil art and portrait drawings.",
  keywords: [
    "Pencil Sketch Artist",
    "Mono-realistic Art",
    "Graphite Portraits",
    "Pencil Drawings",
    "Realistic Sketches",
    "Portrait Artist",
    "Vijay Kumar Kosireddy Art",
    "Graphite Art Gallery",
  ],
  openGraph: {
    title: "Art Gallery | Vijay Kumar Kosireddy - Pencil Sketches",
    description: "Explore mono-realistic pencil sketches and graphite portraits",
    url: "https://vijaykumarkosireddy.com/arts",
    type: "website",
  },
}

export const dynamic = "force-dynamic"

export default async function ArtsPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-12">
      <ArtsHero />
      <ArtsGrid />
      <ArtsBio />
    </div>
  )
}
