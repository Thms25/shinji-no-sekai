import { NextRequest, NextResponse } from 'next/server'
import { getArtistById } from '@/utils/db/artists'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const artist = await getArtistById(id)

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    return NextResponse.json({
      id,
      displayName: artist.displayName,
      email: artist.email,
    })
  } catch (err) {
    console.error('artist-meta error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch artist.' },
      { status: 500 },
    )
  }
}
