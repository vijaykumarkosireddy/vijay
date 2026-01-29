import MusicHero from "@/components/music/MusicHero"
import MusicGrid from "@/components/music/MusicGrid"

export const dynamic = "force-dynamic"

export default async function MusicPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20 md:px-12">
      <MusicHero />
      <MusicGrid />
    </div>
  )
}
