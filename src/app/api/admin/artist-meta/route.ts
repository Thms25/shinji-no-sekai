import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/mongodb'

const DB_NAME = process.env.MONGODB_DB_NAME || 'Shinji'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const db = await getDb(DB_NAME)
    const users = db.collection('users')

    const doc = await users.findOne<{ displayName?: string; email?: string }>({
      _id: new ObjectId(id),
    })

    if (!doc) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 })
    }

    return NextResponse.json({
      id,
      displayName: doc.displayName,
      email: doc.email,
    })
  } catch (err) {
    console.error('artist-meta error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch artist.' },
      { status: 500 },
    )
  }
}
