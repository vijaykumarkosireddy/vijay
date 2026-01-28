import Image from "next/image"
import Link from "next/link"
import { SITE_CONTENT } from "@/constants/content"
import { ROUTES } from "@/constants/navigation"

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,theme(colors.primary/15%)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16">
        <div className="flex-1 animate-reveal space-y-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full glass border-primary/20">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">
              {SITE_CONTENT.TAGLINE}
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white italic">
            {SITE_CONTENT.HERO.TITLE.split(" ").map((word, i) => (
              <span key={i} className={i === 1 ? "text-gold block" : "block"}>
                {word}
              </span>
            ))}
          </h1>

          <p className="max-w-xl text-base md:text-xl text-foreground/60 font-light leading-relaxed">
            {SITE_CONTENT.HERO.SUBTITLE}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4 justify-center lg:justify-start">
            <Link
              href={ROUTES.find(r => r.label === "Music")?.path || "/music"}
              className="px-8 md:px-10 py-4 md:py-5 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[12px] md:text-sm rounded-2xl transition-all gold-glow"
            >
              The Melodies
            </Link>
            <Link
              href={ROUTES.find(r => r.label === "Arts")?.path || "/arts"}
              className="px-8 md:px-10 py-4 md:py-5 glass border-primary/20 text-white font-black uppercase tracking-widest text-[12px] md:text-sm rounded-2xl transition-all hover:border-primary"
            >
              The Sketches
            </Link>
          </div>
        </div>

        <div className="flex-1 relative w-full aspect-[4/5] lg:aspect-square animate-reveal-slow group">
          <div className="absolute inset-0 border-[20px] rounded-[3rem] -rotate-3 transition-transform group-hover:rotate-0 duration-1000" />
          <div className="absolute inset-0 border-[1px] rounded-[3rem] rotate-3 transition-transform group-hover:rotate-0 duration-1000" />
          <div className="relative h-full w-full overflow-hidden rounded-[3rem] shadow-2xl">
            <Image
              src={SITE_CONTENT.HERO.IMAGE}
              alt={SITE_CONTENT.NAME}
              fill
              className="object-cover transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
