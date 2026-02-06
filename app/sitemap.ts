import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://vijaykumarkosireddy.vercel.app"
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

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
    // Fetch dynamic music pages via API
    const musicResponse = await fetch(`${apiBaseUrl}/api/music`, {
      cache: "no-store",
    })
    const music = musicResponse.ok ? await musicResponse.json() : []
    const musicPages: MetadataRoute.Sitemap = music.map((item: any) => ({
      url: `${baseUrl}/music/${item._id}`,
      lastModified: new Date(item.createdAt || item.updatedAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    // Fetch dynamic art pages via API
    const artsResponse = await fetch(`${apiBaseUrl}/api/arts`, {
      cache: "no-store",
    })
    const arts = artsResponse.ok ? await artsResponse.json() : []
    const artPages: MetadataRoute.Sitemap = arts.map((item: any) => ({
      url: `${baseUrl}/arts/${item._id}`,
      lastModified: new Date(item.createdAt || item.updatedAt || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    // Fetch dynamic blog pages via API (only published, non-draft)
    const blogsResponse = await fetch(`${apiBaseUrl}/api/blogs?published=true&isDraft=false`, {
      cache: "no-store",
    })
    const blogs = blogsResponse.ok ? await blogsResponse.json() : []
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
