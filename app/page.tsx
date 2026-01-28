import Hero from "./components/landing/Hero";
import MusicSection from "./components/landing/MusicSection";
import ArtSection from "./components/landing/ArtSection";
import Testimonials from "./components/landing/Testimonials";
import Link from "next/link";
import { SITE_CONTENT } from "@/constants/content";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <MusicSection />
      <ArtSection />
      <Testimonials />

      {/* Contact CTA Section */}
      <section className="py-16 md:py-24 px-6 text-center">
        <div className="mx-auto max-w-3xl space-y-8 glass p-8 md:p-12 rounded-[2.5rem] animate-scale-in">
          <h2 className="text-3xl font-black tracking-tighter md:text-5xl italic text-gold">Start Your Journey</h2>
          <p className="text-foreground/60 font-light">
            Whether you want to master the intricacies of Carnatic Music or commission a custom pencil portrait, let's connect.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center lg:pt-4">
            <Link
              href="/contact"
              className="px-10 py-5 bg-primary text-primary-foreground font-black uppercase tracking-widest text-sm rounded-2xl transition-all hover:scale-105 active:scale-95 gold-glow"
            >
              Contact Me
            </Link>
            <a
              href={`mailto:${SITE_CONTENT.CONTACT.EMAILS[0]}`}
              className="px-10 py-5 glass border-primary/20 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all hover:border-primary"
            >
              Email Directly
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
