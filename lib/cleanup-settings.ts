import clientPromise from "./mongodb"
import { DB_CONFIG } from "@/constants/database"

async function clearSettings() {
  const client = await clientPromise
  const db = client.db(DB_CONFIG.NAME)
  // Cleaning up the old settings collection to ensure purely env-based auth
  await db
    .collection(DB_CONFIG.COLLECTIONS.SETTINGS)
    .drop()
    .catch(() => {})
}

clearSettings()
