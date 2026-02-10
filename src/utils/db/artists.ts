import { ObjectId } from 'mongodb'
import { getDbInstance } from './client'
import type { User } from '../type-utils'

export async function getArtistById(id: string): Promise<User | null> {
  try {
    const db = await getDbInstance()
    if (!db) return null

    const artistDoc = await db
      .collection('users')
      .findOne<{ displayName?: string; email?: string }>({
        _id: new ObjectId(id),
      })

    if (!artistDoc) return null

    return {
      id,
      ...artistDoc,
    } as User
  } catch (error) {
    console.error('Error fetching artist by id:', error)
    return null
  }
}

export async function listArtistsForAdmin(): Promise<
  Array<{
    id: string
    displayName?: string
    email: string
    tracksCount?: number
    role?: string
  }>
> {
  try {
    const db = await getDbInstance()
    if (!db) return []

    const users = db.collection('users')

    const docs = await users
      .find<{
        _id: ObjectId
        displayName?: string
        email: string
        tracksCount?: number
        role?: string
      }>({
        role: 'artist',
      })
      .toArray()

    return docs.map(doc => ({
      id: doc._id.toString(),
      displayName: doc.displayName,
      email: doc.email,
      tracksCount: doc.tracksCount ?? 0,
      role: doc.role,
    }))
  } catch (error) {
    console.error('Error listing artists for admin:', error)
    return []
  }
}

