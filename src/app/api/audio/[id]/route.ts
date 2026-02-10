import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'
import { getAudioBucket } from '@/lib/mongodb'

const DB_NAME = process.env.MONGODB_DB_NAME || 'Shinji'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const bucket = await getAudioBucket(DB_NAME, 'audio')
    const objectId = new ObjectId(id)

    const downloadStream = bucket.openDownloadStream(objectId)

    const headers = new Headers()
    headers.set('Content-Type', 'audio/mpeg')
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    return new Response(downloadStream as any, { headers })
  } catch (err) {
    console.error('Audio stream error:', err)
    return new Response('Not found', { status: 404 })
  }
}

