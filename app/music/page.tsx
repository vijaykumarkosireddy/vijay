import MusicHero from "@/components/music/MusicHero"
import MusicGrid from "@/components/music/MusicGrid"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Music Performances | Vijay Kumar Kosireddy - Carnatic Music",
  description: "Explore Carnatic music performances by Vijay Kumar Kosireddy. Watch concerts, classical compositions, and devotional songs. Expert music teacher at Sree Saraswathi Sangeetha Vidhayalam.",
  keywords: [
    "Carnatic Music Performances",
    "Indian Classical Music",
    "Vijay Kumar Kosireddy Music",
    "Carnatic Vocal",
    "Music Concerts",
    "Devotional Songs",
    "Classical Compositions",
  ],
  openGraph: {
    title: "Music Performances | Vijay Kumar Kosireddy",
    description: "Explore Carnatic music performances and concerts by Vijay Kumar Kosireddy",
    url: "https://vijaykumarkosireddy.com/music",
    type: "website",
  },
}

export const dynamic = "force-dynamic"

export default async function MusicPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-12">
      <MusicHero />
      <MusicGrid />
    </div>
  )
}
