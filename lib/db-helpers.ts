import clientPromise from "./mongodb"
import { DB_CONFIG } from "@/constants/database"
import { ObjectId } from "mongodb"

export async function getMusicItems(onlyFavorites = false) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  const query = onlyFavorites ? { isFavorite: true } : {}
  return db.collection(DB_CONFIG.COLLECTIONS.MUSIC).find(query).sort({ createdAt: -1 }).toArray()
}

export async function getArtItems(onlyFavorites = false) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  const query = onlyFavorites ? { isFavorite: true } : {}
  return db.collection(DB_CONFIG.COLLECTIONS.ARTS).find(query).sort({ createdAt: -1 }).toArray()
}

export async function getArtItem(id: string) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db.collection(DB_CONFIG.COLLECTIONS.ARTS).findOne({ _id: new ObjectId(id) })
}

export async function getMusicItem(id: string) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db.collection(DB_CONFIG.COLLECTIONS.MUSIC).findOne({ _id: new ObjectId(id) })
}

export async function getTestimonials(onlyFavorites = false) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  const query = onlyFavorites ? { isFavorite: true } : {}
  return db
    .collection(DB_CONFIG.COLLECTIONS.TESTIMONIALS)
    .find(query)
    .sort({ createdAt: -1 })
    .toArray()
}

export async function addMusicItem(item: any) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db
    .collection(DB_CONFIG.COLLECTIONS.MUSIC)
    .insertOne({ ...item, isFavorite: item.isFavorite || false, createdAt: new Date() })
}

export async function addArtItem(item: any) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db
    .collection(DB_CONFIG.COLLECTIONS.ARTS)
    .insertOne({ ...item, isFavorite: item.isFavorite || false, createdAt: new Date() })
}

export async function addTestimonial(item: any) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db
    .collection(DB_CONFIG.COLLECTIONS.TESTIMONIALS)
    .insertOne({ ...item, isFavorite: item.isFavorite || false, createdAt: new Date() })
}

export async function updateItem(
  collection: keyof typeof DB_CONFIG.COLLECTIONS,
  id: string,
  data: any
) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  const { _id, ...updateData } = data
  return db
    .collection(DB_CONFIG.COLLECTIONS[collection])
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData })
}

export async function toggleFavorite(
  collection: keyof typeof DB_CONFIG.COLLECTIONS,
  id: string,
  status: boolean
) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db
    .collection(DB_CONFIG.COLLECTIONS[collection])
    .updateOne({ _id: new ObjectId(id) }, { $set: { isFavorite: status } })
}

export async function deleteItem(collection: keyof typeof DB_CONFIG.COLLECTIONS, id: string) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db
    .collection(DB_CONFIG.COLLECTIONS[collection])
    .findOneAndDelete({ _id: new ObjectId(id) })
}

/* --- BOOKING HELPERS --- */

export async function getBookings() {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db.collection(DB_CONFIG.COLLECTIONS.BOOKINGS).find({}).sort({ createdAt: -1 }).toArray()
}

export async function addBooking(booking: any) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db
    .collection(DB_CONFIG.COLLECTIONS.BOOKINGS)
    .insertOne({ ...booking, status: "pending", createdAt: new Date() })
}

/* --- BLOG HELPERS --- */

// Generate unique slug from title with counter suffix if needed
export async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)

  // Generate base slug from title
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  let slug = baseSlug
  let counter = 1

  // Check if slug exists, if so add counter suffix
  while (true) {
    const query: any = { slug }
    if (excludeId) {
      query._id = { $ne: new ObjectId(excludeId) }
    }

    const existing = await db.collection(DB_CONFIG.COLLECTIONS.BLOGS).findOne(query)

    if (!existing) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export async function getBlogPosts(filters?: {
  published?: boolean
  tag?: string
  isDraft?: boolean
}) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)

  let query: any = {}
  if (filters?.published !== undefined) {
    query.published = filters.published
  }
  if (filters?.isDraft !== undefined) {
    query.isDraft = filters.isDraft
  }
  if (filters?.tag) {
    query.tags = { $in: [filters.tag] }
  }

  return db.collection(DB_CONFIG.COLLECTIONS.BLOGS).find(query).sort({ createdAt: -1 }).toArray()
}

export async function getPublishedBlogs() {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db
    .collection(DB_CONFIG.COLLECTIONS.BLOGS)
    .find({ published: true, isDraft: false })
    .sort({ createdAt: -1 })
    .toArray()
}

export async function getBlogPost(id: string) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db.collection(DB_CONFIG.COLLECTIONS.BLOGS).findOne({ _id: new ObjectId(id) })
}

export async function getBlogPostBySlug(slug: string) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db.collection(DB_CONFIG.COLLECTIONS.BLOGS).findOne({ slug })
}

export async function addBlogPost(post: any) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)

  // Generate unique slug
  const slug = await generateUniqueSlug(post.title)

  return db.collection(DB_CONFIG.COLLECTIONS.BLOGS).insertOne({
    ...post,
    slug,
    published: post.published ?? false,
    isDraft: post.isDraft ?? true,
    isFavorite: post.isFavorite ?? false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

export async function updateBlogPost(id: string, data: any) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  const { _id, ...updateData } = data

  // Regenerate slug if title changed
  if (updateData.title) {
    updateData.slug = await generateUniqueSlug(updateData.title, id)
  }

  return db
    .collection(DB_CONFIG.COLLECTIONS.BLOGS)
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...updateData, updatedAt: new Date() } })
}

export async function toggleBlogPublished(id: string, status: boolean) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db
    .collection(DB_CONFIG.COLLECTIONS.BLOGS)
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { published: status, isDraft: !status, updatedAt: new Date() } }
    )
}

export async function toggleBlogFavorite(id: string, status: boolean) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db
    .collection(DB_CONFIG.COLLECTIONS.BLOGS)
    .updateOne({ _id: new ObjectId(id) }, { $set: { isFavorite: status, updatedAt: new Date() } })
}

export async function deleteBlogPost(id: string) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  return db.collection(DB_CONFIG.COLLECTIONS.BLOGS).findOneAndDelete({ _id: new ObjectId(id) })
}

/* --- NEWSLETTER HELPERS --- */

export async function subscribeToNewsletter(
  email: string,
  name: string = "",
  source: string = "contact_form"
) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)

  // Check if email already exists
  const existing = await db
    .collection(DB_CONFIG.COLLECTIONS.NEWSLETTER_SUBSCRIBERS)
    .findOne({ email: email.toLowerCase() })

  if (existing) {
    if (existing.active) {
      // Update name if provided and different from existing, or if source is more recent
      const shouldUpdateName =
        name &&
        name.trim() &&
        (existing.name !== name.trim() || !existing.lastSource || source === "contact_form") // Prioritize contact form names

      if (shouldUpdateName) {
        await db.collection(DB_CONFIG.COLLECTIONS.NEWSLETTER_SUBSCRIBERS).updateOne(
          { email: email.toLowerCase() },
          {
            $set: {
              name: name.trim(),
              updatedAt: new Date(),
              lastSource: source,
            },
          }
        )
        return { success: true, message: "Already subscribed. Name updated!" }
      }
      return { success: true, message: "Already subscribed" }
    } else {
      // Reactivate subscription and update name
      await db.collection(DB_CONFIG.COLLECTIONS.NEWSLETTER_SUBSCRIBERS).updateOne(
        { email: email.toLowerCase() },
        {
          $set: {
            active: true,
            name: name.trim() || existing.name,
            updatedAt: new Date(),
            lastSource: source,
          },
        }
      )
      return { success: true, message: "Subscription reactivated" }
    }
  }

  // Create new subscription
  await db.collection(DB_CONFIG.COLLECTIONS.NEWSLETTER_SUBSCRIBERS).insertOne({
    email: email.toLowerCase(),
    name: name.trim(),
    active: true,
    subscribedAt: new Date(),
    updatedAt: new Date(),
    lastSource: source,
  })

  return { success: true, message: "Subscribed successfully" }
}

export async function unsubscribeFromNewsletter(email: string) {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)

  const result = await db
    .collection(DB_CONFIG.COLLECTIONS.NEWSLETTER_SUBSCRIBERS)
    .updateOne({ email: email.toLowerCase() }, { $set: { active: false, updatedAt: new Date() } })

  if (result.matchedCount === 0) {
    return { success: false, message: "Subscription not found" }
  }

  return { success: true, message: "Unsubscribed successfully" }
}
