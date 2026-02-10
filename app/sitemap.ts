import { MetadataRoute } from "next"
import clientPromise from "@/lib/mongodb"
import { DB_CONFIG } from "@/constants/database"

export const revalidate = false // Only revalidate manually from admin dashboard

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://vijaykumarkosireddy.vercel.app"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/music`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/arts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ]

  try {
    // Connect to database directly
    const client = await clientPromise
    const db = client.db(DB_CONFIG.NAME)

    // Fetch dynamic music pages
    const music = await db
      .collection(DB_CONFIG.COLLECTIONS.MUSIC)
      .find({})
      .project({ _id: 1, createdAt: 1, updatedAt: 1 })
      .toArray()

    const musicPages: MetadataRoute.Sitemap = music.map((item: any) => ({
      url: `${baseUrl}/music/${item._id}`,
      lastModified: new Date(item.updatedAt || item.createdAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    // Fetch dynamic art pages
    const arts = await db
      .collection(DB_CONFIG.COLLECTIONS.ARTS)
      .find({})
      .project({ _id: 1, createdAt: 1, updatedAt: 1 })
      .toArray()

    const artPages: MetadataRoute.Sitemap = arts.map((item: any) => ({
      url: `${baseUrl}/arts/${item._id}`,
      lastModified: new Date(item.updatedAt || item.createdAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    // Fetch dynamic blog pages (only published, non-draft)
    const blogs = await db
      .collection(DB_CONFIG.COLLECTIONS.BLOGS)
      .find({ published: true, isDraft: false })
      .project({ slug: 1, updatedAt: 1, createdAt: 1 })
      .toArray()

    const blogPages: MetadataRoute.Sitemap = blogs.map((post: any) => ({
      url: `${baseUrl}/blogs/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

    return [...staticPages, ...musicPages, ...artPages, ...blogPages]
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error)
    // Return static pages only if database fetch fails
    return staticPages
  }
}
