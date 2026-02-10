'use server'

import { ObjectId } from 'mongodb'
import { getDb } from '@/lib/mongodb'

// Name of the database you configured in MONGODB_URI (e.g. shinji)
const DB_NAME = process.env.MONGODB_DB_NAME || 'Shinji'

export async function createArtist(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { error: 'All fields are required' }
  }

  try {
    const db = await getDb(DB_NAME)
    const users = db.collection('users')

    const existing = await users.findOne({ email })
    if (existing) {
      return { error: 'A user with this email already exists.' }
    }

    // Store password as plain text per your request (not secure, but simple)
    await users.insertOne({
      email,
      password,
      role: 'artist',
      displayName: name,
      createdAt: new Date().toISOString(),
      tracksCount: 0,
    })

    return { success: true, message: `Artist ${name} created successfully.` }
  } catch (error: unknown) {
    console.error('Error creating artist:', error)
    return {
      error:
        error instanceof Error ? error.message : 'Failed to create artist.',
    }
  }
}

export async function createTrack(formData: FormData) {
  const title = formData.get('title') as string
  const versionName = formData.get('versionName') as string
  const artistId = formData.get('artistId') as string
  const url = formData.get('url') as string

  if (!title || !versionName || !artistId || !url) {
    return {
      error: 'Missing fields: title, version name, artist, or file URL.',
    }
  }

  try {
    const db = await getDb(DB_NAME)
    const tracks = db.collection('tracks')
    const versions = db.collection('versions')
    const users = db.collection('users')

    const now = new Date().toISOString()

    const trackResult = await tracks.insertOne({
      title,
      artistId,
      status: 'In Progress',
      createdAt: now,
      updatedAt: now,
    })

    const trackObjectId = trackResult.insertedId

    await versions.insertOne({
      trackId: trackObjectId.toString(),
      name: versionName,
      url,
      createdAt: now,
    })

    await users.updateOne(
      { _id: new ObjectId(artistId) },
      { $inc: { tracksCount: 1 } },
    )

    return { success: true }
  } catch (e: unknown) {
    console.error('Create track error:', e)
    return { error: e instanceof Error ? e.message : 'Failed to create track.' }
  }
}
