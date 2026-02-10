import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { Track } from '@/utils/type-utils'

const DB_NAME = process.env.MONGODB_DB_NAME || 'Shinji'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const artistId = searchParams.get('artistId')

    if (!artistId) {
      return NextResponse.json(
        { error: 'artistId is required' },
        { status: 400 },
      )
    }

    const db = await getDb(DB_NAME)
    const tracksCol = db.collection('tracks')

    const docs = await tracksCol
      .find<{ title: string; artistId: string; status: string; createdAt: string; updatedAt: string }>({
        artistId,
      })
      .toArray()

    const tracks: Track[] = docs.map((doc: any) => ({
      id: doc._id.toString(),
      title: doc.title,
      artistId: doc.artistId,
      status: doc.status,
      createdAt: doc.createdAt?.toString() || '',
      updatedAt: doc.updatedAt?.toString() || '',
    }))

    return NextResponse.json({ tracks })
  } catch (err) {
    console.error('by-artist error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch tracks.' },
      { status: 500 },
    )
  }
}

