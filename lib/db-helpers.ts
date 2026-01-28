import clientPromise from "./mongodb"
import { DB_CONFIG } from "@/constants/database"
import { ObjectId } from "mongodb"

/* --- CONTENT HELPERS --- */

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
  return db.collection(DB_CONFIG.COLLECTIONS[collection]).deleteOne({ _id: new ObjectId(id) })
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
