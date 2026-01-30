import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getMusicItem } from "@/lib/db-helpers"
import ShareButton from "@/components/shared/ShareButton"
import { SITE_CONTENT } from "@/constants/content"

// Define Params type based on Next.js 15+ conventions (params is a promise)
type Params = Promise<{ id: string }>

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { id } = await props.params
  // Handle invalid IDs
  if (!id || id.length !== 24) {
    return {
      title: "Performance Not Found",
    }
  }

  const item = await getMusicItem(id)

  if (!item) {
    return {
      title: "Performance Not Found",
    }
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${item.url.replace("watch?v=", "embed/").split("/").pop()?.split("?")[0]
    }/maxresdefault.jpg`

  return {
    title: `${item.title} | ${SITE_CONTENT.NAME}`,
    description: `Watch this Carnatic music performance by Vijay Kumar Kosireddy: ${item.title}`,
    openGraph: {
      title: `${item.title} | ${SITE_CONTENT.NAME}`,
      description: `Watch this Carnatic music performance by Vijay Kumar Kosireddy: ${item.title}`,
      images: [thumbnailUrl],
    },
  }
}

export default async function MusicItemPage(props: { params: Params }) {
  const { id } = await props.params

  if (!id || id.length !== 24) {
    notFound()
  }

  const item = await getMusicItem(id)

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-transparent py-20 px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/music"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Performances
        </Link>

        <div className="space-y-12">
          {/* Main Video Area */}
          <div className="aspect-video relative overflow-hidden rounded-2xl glass border-none shadow-2xl animate-reveal">
            <iframe
              className="absolute inset-0 h-full w-full border-0"
              src={item.url.replace("watch?v=", "embed/").split("&")[0] + "?autoplay=1"}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-between items-start animate-reveal-slow">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-4">
                <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest">
                  {item.platform || "Performance"}
                </span>
                <span className="text-sm text-foreground/40 font-medium">
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-tight">
                {item.title}
              </h1>
              <p className="text-lg text-foreground/70 font-light leading-relaxed">
                Experience the depth of Carnatic tradition through this performance.
                Vijay Kumar Kosireddy brings years of dedication and teaching expertise to every rendition.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full md:w-auto">
              {item.instagramUrl && (
                <a
                  href={item.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass border border-white/10 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wide hover:scale-105"
                >
                  View on {item.platform === 'Youtube' ? 'YouTube' : 'Instagram'}
                </a>
              )}

              <div className="inline-flex items-center justify-between gap-4 px-6 py-4 rounded-xl bg-primary/10 border border-primary/20">
                <span className="text-sm font-bold text-gold uppercase tracking-widest">Share</span>
                <ShareButton
                  title={item.title}
                  text={`Watch this performance by Vijay Kumar Kosireddy: ${item.title}`}
                  url={`https://vijaykumarkosireddy.vercel.app/music/${id}`}
                  className="hover:scale-110 bg-primary/20 text-gold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
