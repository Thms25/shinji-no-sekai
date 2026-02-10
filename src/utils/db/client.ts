import { getDb } from '@/lib/mongodb'

const DB_NAME = process.env.MONGODB_DB_NAME || 'Shinji'

/**
 * Shared helper to obtain a MongoDB database instance.
 * Returns null if the connection fails so callers can handle it gracefully.
 */
export async function getDbInstance() {
  try {
    return await getDb(DB_NAME)
  } catch (error) {
    console.error('Error getting database instance:', error)
    return null
  }
}

