import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getArtItem } from "@/lib/db-helpers"
import ShareButton from "@/components/shared/ShareButton"
import { SITE_CONTENT } from "@/constants/content"

// Define Params type based on Next.js 15+ conventions (params is a promise)
type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { id } = await props.params
  // Handle invalid IDs gracefully
  if (!id || id.length !== 24) {
    return {
      title: "Art Not Found",
    }
  }

  const item = await getArtItem(id)

  if (!item) {
    return {
      title: "Art Not Found",
    }
  }

  return {
    title: `${item.title} | ${SITE_CONTENT.NAME}`,
    description: `View the detailed sketch based on ${item.title} by Vijay Kumar Kosireddy.`,
    openGraph: {
      title: `${item.title} | ${SITE_CONTENT.NAME}`,
      description: `View the detailed sketch based on ${item.title} by Vijay Kumar Kosireddy.`,
      images: [item.imageUrl],
    },
  }
}

export default async function ArtItemPage(props: { params: Params }) {
  const { id } = await props.params

  if (!id || id.length !== 24) {
    notFound()
  }

  const item = await getArtItem(id)

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-transparent py-20 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/arts"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Gallery
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-start">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] glass border-none gold-glow shadow-2xl animate-reveal">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center space-y-8 animate-reveal-slow">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter capitalize leading-tight">
                {item.title}
              </h1>
              <div className="flex items-center gap-4">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold uppercase tracking-widest text-gold text-nowrap">
                  Graphite on Paper
                </span>
                <span className="text-sm text-foreground/40 font-medium">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <p className="text-lg text-foreground/70 font-light leading-relaxed">
              A detailed mono-realistic pencil sketch capturing the essence and emotion of the
              subject. Created with precision using high-grade graphite pencils on archival paper.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              {item.instagramUrl && (
                <a
                  href={item.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:scale-105 transition-transform shadow-lg shadow-primary/20"
                >
                  View on Instagram
                </a>
              )}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-white/10 hover:bg-white/5 transition-colors">
                <span className="text-sm font-medium">Share:</span>
                <ShareButton
                  title={item.title}
                  text={`Check out this amazing sketch by Vijay Kumar Kosireddy: ${item.title}`}
                  url={`https://vijaykumarkosireddy.vercel.app/arts/${id}`}
                  className="hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
