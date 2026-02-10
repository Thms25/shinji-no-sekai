import { NextRequest } from 'next/server'
import { ObjectId } from 'mongodb'
import { getAudioBucket, getDb } from '@/lib/mongodb'

const DB_NAME = process.env.MONGODB_DB_NAME || 'Shinji'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const objectId = new ObjectId(id)
    const db = await getDb(DB_NAME)
    const filesCol = db.collection<{ metadata?: { contentType?: string } }>(
      'images.files',
    )
    const fileDoc = await filesCol.findOne({ _id: objectId })
    const contentType =
      fileDoc?.metadata?.contentType ?? 'application/octet-stream'

    const bucket = await getAudioBucket(DB_NAME, 'images')
    const stream = bucket.openDownloadStream(objectId)

    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    return new Response(stream as unknown as ReadableStream, { headers })
  } catch (err) {
    console.error('Image stream error:', err)
    return new Response('Not found', { status: 404 })
  }
}
