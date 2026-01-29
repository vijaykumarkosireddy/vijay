import Hero from "../components/landing/Hero"
import MusicSection from "../components/landing/MusicSection"
import ArtSection from "../components/landing/ArtSection"
import Testimonials from "../components/landing/Testimonials"

export const dynamic = "force-dynamic"

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <MusicSection />
      <ArtSection />
      <Testimonials />
    </div>
  )
}
