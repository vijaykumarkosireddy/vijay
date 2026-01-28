import { getArtItems } from "@/lib/db-helpers"
import ArtSectionClient from "@/components/shared/ArtSectionClient"

export default async function ArtSection() {
  const artItems = await getArtItems(true) // Fetch favorites

  // Serialize data for client component
  const serializedArtItems = artItems.map((item: any) => ({
    _id: item._id.toString(),
    title: item.title,
    imageUrl: item.imageUrl,
    instagramUrl: item.instagramUrl,
  }))

  return <ArtSectionClient artItems={serializedArtItems} />
}
