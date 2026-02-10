import { ObjectId } from 'mongodb'
import { getDbInstance } from './client'

export type SitePageId = 'home' | 'work'

export interface WorkArtist {
  _id?: ObjectId
  name: string
  description: string
  roles: string[]
  image: string
  spotify_id?: string
  spotify_url?: string
}

export interface WorkPageContent {
  artists: WorkArtist[]
}

export interface HomePageContent {
  headline: string
  subheadline: string
  ctaPrimaryLabel: string
  ctaPrimaryHref: string
  ctaSecondaryLabel: string
  ctaSecondaryHref: string
}

export type SitePageContent = {
  home: HomePageContent
  work: WorkPageContent
}

export interface ContentDocument<P extends SitePageId = SitePageId> {
  _id?: ObjectId
  page: P
  content: SitePageContent[P]
  updatedAt: string
}

const COLLECTION_NAME = 'content'

export async function getPageContent<P extends SitePageId>(
  page: P,
): Promise<ContentDocument<P> | null> {
  const db = await getDbInstance()
  if (!db) return null

  const collection = db.collection<ContentDocument>(COLLECTION_NAME)
  const doc = await collection.findOne({ page })
  return (doc as ContentDocument<P> | null) ?? null
}

export async function upsertPageContent<P extends SitePageId>(
  page: P,
  content: SitePageContent[P],
): Promise<ContentDocument<P> | null> {
  const db = await getDbInstance()
  if (!db) return null

  const collection = db.collection<ContentDocument>(COLLECTION_NAME)
  const now = new Date().toISOString()

  const result = await collection.findOneAndUpdate(
    { page },
    {
      $set: {
        page,
        content,
        updatedAt: now,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
    },
  )

  return (result as ContentDocument<P> | null) ?? null
}

