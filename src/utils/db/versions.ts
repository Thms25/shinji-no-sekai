import { ObjectId } from 'mongodb'
import { getDbInstance } from './client'
import type { TrackVersion } from '../type-utils'

export async function getVersionsByTrackId(
  trackId: string,
): Promise<TrackVersion[]> {
  try {
    const db = await getDbInstance()
    if (!db) return []

    const versionsDocs = await db
      .collection('versions')
      .find<{ _id: ObjectId; name: string; url: string; createdAt: string | Date }>({
        trackId,
      })
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
    console.error('Error fetching versions by track id:', error)
    return []
  }
}

