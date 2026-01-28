"use client";

import { getArtItems } from "@/lib/db-helpers";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONTENT } from "@/constants/content";
import { ROUTES } from "@/constants/navigation";
import { useState } from "react";
import ArtLightbox from "@/components/shared/ArtLightbox";

export default function ArtSectionClient({ artItems }: { artItems: any[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-20 md:py-32 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-gold">Fine Art Portfolio</h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-3xl">
            Mono-realistic Pencil Sketches
          </h3>
          <p className="max-w-2xl text-base md:text-lg text-foreground/60 font-light">
            Each stroke captures a soul. Explore a gallery where graphite meets life.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-12 md:grid-rows-2 md:h-[800px]">
          {artItems.length > 0 ? (
            <>
              {/* Main Feature (First Favorite) */}
              <div
                onClick={() => openLightbox(0)}
                className="md:col-span-7 md:row-span-2 relative aspect-[4/5] md:aspect-auto overflow-hidden rounded-[2.5rem] glass group cursor-pointer border-none gold-glow"
              >
                <Image
                  src={artItems[0].imageUrl}
                  alt={artItems[0].title}
                  fill
                  className="object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">Premium Piece</span>
                  <h4 className="text-2xl md:text-3xl font-bold mb-4">{artItems[0].title}</h4>
                  <p className="text-sm text-white/60">Click to view full screen</p>
                </div>
              </div>

              {/* Grid items */}
              <div
                onClick={() => artItems[1] && openLightbox(1)}
                className="md:col-span-5 relative aspect-[4/5] md:aspect-auto overflow-hidden rounded-[2.5rem] glass group border-none cursor-pointer"
              >
                {artItems[1] ? (
                  <>
                    <Image
                      src={artItems[1].imageUrl}
                      alt={artItems[1].title}
                      fill
                      className="object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm font-bold text-white">Click to enlarge</p>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
                    <span className="text-foreground/10 text-4xl font-black italic tracking-tighter">SKETCH GALLERY</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div
              onClick={() => openLightbox(0)}
              className="md:col-span-12 md:row-span-2 relative aspect-[4/5] md:aspect-auto overflow-hidden rounded-[2.5rem] glass group cursor-pointer border-none gold-glow"
            >
              <Image
                src={SITE_CONTENT.BIO.SECONDARY_IMAGE}
                alt="Art Masterpiece"
                fill
                className="object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-xs font-bold uppercase tracking-widest text-gold mb-2 block">Featured Piece</span>
                <h4 className="text-2xl md:text-3xl font-bold mb-4">Graphite Soul Portrait</h4>
              </div>
            </div>
          )}

          <div className="md:col-span-5 relative py-12 md:py-0 overflow-hidden rounded-[2.5rem] glass flex items-center justify-center border-accent/10">
            <Link
              href={ROUTES.find(r => r.label === "Arts")?.path || "/arts"}
              className="group flex flex-col items-center gap-6"
            >
              <div className="h-20 w-20 rounded-full border border-primary flex items-center justify-center group-hover:bg-primary transition-all duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-primary-foreground transition-colors">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </div>
              <span className="text-sm font-bold tracking-widest text-gold uppercase">Enter the Gallery</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && artItems.length > 0 && (
        <ArtLightbox
          images={artItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}
