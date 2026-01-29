import Image from "next/image"
import { SITE_CONTENT } from "@/constants/content"

export default function ArtsBio() {
  return (
    <div className="mt-40 glass p-8 sm:p-12 rounded-2xl sm:rounded-[3rem] border-accent/5">
      <div className="grid gap-8 lg:gap-16 lg:grid-cols-2 items-center">
        {/* Text Content - Left on Desktop, Bottom on Mobile */}
        <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tighter italic gold-glow inline-block px-3 sm:px-4 py-2 bg-primary/10 rounded-xl">
            The Artist Behind the Pencil
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-foreground/70 font-light leading-relaxed">
            {SITE_CONTENT.BIO.EXTENDED}
          </p>
        </div>

        {/* Image - Right on Desktop, Top on Mobile */}
        <div className="relative h-64 sm:h-80 lg:h-[500px] overflow-hidden rounded-xl sm:rounded-[2.5rem] order-1 lg:order-2">
          <Image
            src={SITE_CONTENT.BIO.SECONDARY_IMAGE}
            alt="Vijay Artist"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}
