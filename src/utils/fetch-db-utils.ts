import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { Comment, Track, TrackVersion, User } from './type-utils'

const DB_NAME = process.env.MONGODB_DB_NAME || 'Shinji'
async function getDbInstance() {
  try {
    return await getDb(DB_NAME)
  } catch (error) {
    console.error('Error getting database instance:', error)
    return null
  }
}

// fetch artist
export async function getArtist(id: string) {
  try {
    const db = await getDbInstance()
    if (!db) return null

    const artistDoc = await db
      .collection('users')
      .findOne<{ displayName?: string; email?: string }>({
        _id: new ObjectId(id),
      })

    if (!artistDoc) return null

    const artist = {
      id,
      ...artistDoc,
    } as User

    return artist
  } catch (error) {
    console.error('Error fetching artist:', error)
    return null
  }
}

// fetch track
export async function getTrack(id: string) {
  try {
    const db = await getDbInstance()
    if (!db) return null

    const trackDoc = await db.collection('tracks').findOne<{
      _id: ObjectId
      title: string
      artistId: string
      status: string
      createdAt: string | Date
      updatedAt: string | Date
    }>({
      _id: new ObjectId(id),
    })

    if (!trackDoc) return null

    // Strip out the original MongoDB _id (which is not serializable for Next.js props)
    // and normalise any Date fields to strings so the object is fully JSON-safe.
    const { _id, createdAt, updatedAt, ...rest } = trackDoc

    const track = {
      id: _id.toString() as string,
      ...rest,
      createdAt: createdAt ? createdAt.toString() : '',
      updatedAt: updatedAt ? updatedAt.toString() : '',
    } as Track

    return track
  } catch (error) {
    console.error('Error fetching track:', error)
    return null
  }
}

// Fetch versions
export async function getVersions(id: string) {
  try {
    const db = await getDbInstance()
    if (!db) return null

    const versionsDocs = await db
      .collection('versions')
      .find<{ _id: ObjectId; name: string; url: string; createdAt: string | Date }>({ trackId: id })
      .sort({ createdAt: 1 })
      .toArray()

    const versions = versionsDocs.map(
      doc =>
        ({
          id: doc._id.toString(),
          name: doc.name,
          url: doc.url,
          createdAt: doc.createdAt?.toString() || '',
        }) as TrackVersion,
    )

    return versions
  } catch (error) {
    console.error('Error fetching versions:', error)
    return null
  }
}

// fetch comments
export async function getComments(id: string) {
  try {
    const db = await getDbInstance()
    if (!db) return null

    const commentsDocs = await db
      .collection('comments')
      .find({
        trackId: id,
      })
      .sort({ createdAt: -1 })
      .toArray()

    const comments = commentsDocs.map(
      doc =>
        ({
          id: doc._id.toString(),
          text: doc.text,
          userId: doc.userId,
          userName: doc.userName,
          userRole: doc.userRole,
          createdAt: doc.createdAt?.toString() || '',
          solved: doc.solved,
          timestamp: doc.timestamp,
          versionId: doc.versionId,
        }) as Comment,
    )

    return comments
  } catch (error) {
    console.error('Error fetching comments:', error)
    return null
  }
}
