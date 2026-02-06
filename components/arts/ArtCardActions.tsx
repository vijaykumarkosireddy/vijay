"use client"

import { Instagram } from "lucide-react"
import ShareButton from "@/components/shared/ShareButton"

interface ArtCardActionsProps {
  item: {
    _id: string
    title: string
    instagramUrl?: string
  }
}

export default function ArtCardActions({ item }: ArtCardActionsProps) {
  return (
    <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
      {item.instagramUrl && (
        <a
          href={item.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform"
        >
          <Instagram className="h-5 w-5" />
        </a>
      )}
      <ShareButton
        title={item.title}
        text={`Check out this amazing sketch by Vijay Kumar Kosireddy: ${item.title}`}
        url={`https://vijaykumarkosireddy.vercel.app/arts/${item._id.toString()}`}
        className="h-12 w-12 bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
      />
    </div>
  )
}
