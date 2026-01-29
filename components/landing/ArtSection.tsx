import ArtSectionClient from "@/components/shared/ArtSectionClient"

async function getArtItemsFromAPI(onlyFavorites = false) {
  // Build absolute URL for server-side fetching
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  const url = `${baseUrl}/api/arts${onlyFavorites ? "?favorites=true" : ""}`

  const response = await fetch(url, {
    next: {
      tags: ["arts"],
      revalidate: 3600 * 48, // 48 hours
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch art items")
  }

  return response.json()
}

export default async function ArtSection() {
  const artItems = await getArtItemsFromAPI(true) // Fetch favorites

  // Serialize data for client component
  const serializedArtItems = artItems.map((item: any) => ({
    _id: item._id.toString(),
    title: item.title,
    imageUrl: item.imageUrl,
    instagramUrl: item.instagramUrl,
  }))

  return <ArtSectionClient artItems={serializedArtItems} />
}
