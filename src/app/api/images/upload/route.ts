import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'node:stream'
import jwt from 'jsonwebtoken'
import { getAudioBucket } from '@/lib/mongodb'

const DB_NAME = process.env.MONGODB_DB_NAME || 'Shinji'
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables')
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const decoded = jwt.verify(token, JWT_SECRET as string) as { role?: string }
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 })
    }

    const type = file.type ?? 'application/octet-stream'
    if (!type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image.' },
        { status: 400 },
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const bucket = await getAudioBucket(DB_NAME, 'images')
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')

    const uploadStream = bucket.openUploadStream(safeName, {
      metadata: { contentType: type },
    })

    await new Promise<void>((resolve, reject) => {
      Readable.from(buffer).pipe(uploadStream)
      uploadStream.on('error', reject)
      uploadStream.on('finish', () => resolve())
    })

    const fileId = uploadStream.id.toString()
    const url = `/api/images/${fileId}`

    return NextResponse.json({ fileId, url })
  } catch (err) {
    console.error('Image upload error:', err)
    return NextResponse.json(
      { error: 'Failed to upload image.' },
      { status: 500 },
    )
  }
}
