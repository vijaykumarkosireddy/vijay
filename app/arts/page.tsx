import ArtsHero from "@/components/arts/ArtsHero"
import ArtsGrid from "@/components/arts/ArtsGrid"
import ArtsBio from "@/components/arts/ArtsBio"

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
