import { NextRequest, NextResponse } from 'next/server'
import { getTracksByArtistId } from '@/utils/db/tracks'

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

    const tracks = await getTracksByArtistId(artistId)

    return NextResponse.json({ tracks })
  } catch (err) {
    console.error('by-artist error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch tracks.' },
      { status: 500 },
    )
  }
}

