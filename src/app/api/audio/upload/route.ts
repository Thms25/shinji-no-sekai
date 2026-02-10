import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'node:stream'
import { getAudioBucket } from '@/lib/mongodb'

const DB_NAME = process.env.MONGODB_DB_NAME || 'Shinji'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const bucket = await getAudioBucket(DB_NAME, 'audio')

    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: {
        contentType: file.type || 'application/octet-stream',
      },
    })

    await new Promise<void>((resolve, reject) => {
      Readable.from(buffer).pipe(uploadStream)
      uploadStream.on('error', reject)
      uploadStream.on('finish', () => resolve())
    })

    return NextResponse.json({
      fileId: uploadStream.id.toString(),
    })
  } catch (err) {
    console.error('Audio upload error:', err)
    return NextResponse.json(
      { error: 'Failed to upload audio.' },
      { status: 500 },
    )
  }
}

