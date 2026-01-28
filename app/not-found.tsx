import Link from "next/link"
import { ROUTES } from "@/constants/navigation"
import { SITE_CONTENT } from "@/constants/content"

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,theme(colors.primary/20%)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center space-y-12">
        {/* Error Code */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full glass border-primary/20">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">
              Page Not Found
            </span>
          </div>

          <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-white/10 italic select-none">
            404
          </h1>

          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white italic">
              Lost in the <span className="text-gold">Silence</span>
            </h2>
            <p className="text-lg md:text-xl text-foreground/60 font-light leading-relaxed max-w-xl mx-auto">
              The page you're looking for has wandered off like a forgotten raga. Let's guide you
              back to harmony.
            </p>
          </div>
        </div>

        {/* Navigation Suggestions */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 pt-8">
          {ROUTES.map(route => (
            <Link
              key={route.path}
              href={route.path}
              className="group glass p-6 rounded-2xl border-white/5 hover:border-primary/40 transition-all text-center space-y-3"
            >
              <div className="h-12 w-12 mx-auto rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:text-primary-foreground transition-colors"
                >
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </div>
              <span className="block text-sm font-bold uppercase tracking-widest text-gold">
                {route.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm rounded-2xl transition-all hover:scale-105 active:scale-95 gold-glow"
          >
            Return Home
          </Link>
        </div>

        {/* Helpful Message */}
        <p className="text-sm text-foreground/40 pt-8">
          If you believe this is an error, please{" "}
          <a
            href={`mailto:${SITE_CONTENT.CONTACT.EMAILS[0]}`}
            className="text-gold hover:underline font-bold"
          >
            contact me
          </a>
          .
        </p>
      </div>
    </section>
  )
}
