import { SITE_CONTENT } from "@/constants/content"

export default function MusicHero() {
  return (
    <div className="mb-24 flex flex-col items-center text-center space-y-6 animate-reveal">
      <h1 className="text-5xl font-bold tracking-tighter md:text-7xl title-reveal">
        {SITE_CONTENT.SCHOOL_NAME}
      </h1>
    </div>
  )
}
