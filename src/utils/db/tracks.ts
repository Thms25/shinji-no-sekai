import { ObjectId } from 'mongodb'
import { getDbInstance } from './client'
import type { Track } from '../type-utils'

export async function getTrackById(id: string): Promise<Track | null> {
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

    const { _id, createdAt, updatedAt, ...rest } = trackDoc

    return {
      id: _id.toString(),
      ...rest,
      createdAt: createdAt ? createdAt.toString() : '',
      updatedAt: updatedAt ? updatedAt.toString() : '',
    } as Track
  } catch (error) {
    console.error('Error fetching track by id:', error)
    return null
  }
}

export async function getTracksByArtistId(artistId: string): Promise<Track[]> {
  try {
    const db = await getDbInstance()
    if (!db) return []

    const tracksCol = db.collection('tracks')

    const docs = await tracksCol
      .find<{
        _id: ObjectId
        title: string
        artistId: string
        status: string
        createdAt: string | Date
        updatedAt: string | Date
      }>({
        artistId,
      })
      .toArray()

    return docs.map(
      doc =>
        ({
          id: doc._id.toString(),
          title: doc.title,
          artistId: doc.artistId,
          status: doc.status as Track['status'],
          createdAt: doc.createdAt?.toString() || '',
          updatedAt: doc.updatedAt?.toString() || '',
        }) as Track,
    )
  } catch (error) {
    console.error('Error fetching tracks by artist id:', error)
    return []
  }
}

