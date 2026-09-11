import { ObjectId } from 'mongodb'
import { getDbInstance } from './client'

/**
 * The public site is one page ("Soft Overlap"), so `home` is the only live document.
 * The legacy ids stay in the union so the admin can still read the pre-redesign
 * documents and migrate them forward — nothing writes them any more.
 */
export type SitePageId = 'home'
export type LegacySitePageId = 'work' | 'bio' | 'contact'

/**
 * A single editable string in both site languages. Copy is localised field by field
 * rather than by duplicating the whole tree, so images and other locale-independent
 * values (artist names, years, URLs) are stored — and uploaded — exactly once.
 */
export interface Localized {
  en: string
  fr: string
}

export interface HeroContent {
  kicker: Localized
  /** Rendered plain. */
  nameLead: string
  /** Rendered in the accent colour on wide viewports. */
  nameAccent: string
  role: Localized
}

export interface AboutContent {
  label: Localized
  lead: Localized
  paragraph1: Localized
  paragraph2: Localized
  image: string
}

export interface PrincipleItem {
  title: Localized
  body: Localized
}

export interface CreditItem {
  image: string
  artist: string
  meta: Localized
  year: string
  /** Optional — turns the card into a link out. */
  url?: string
}

export interface StudioSection {
  title: Localized
  linkLabel: Localized
  linkUrl: string
  items: CreditItem[]
}

export interface RoomContent {
  title: Localized
  body: Localized
  image: string
}

export interface LiveSection {
  title: Localized
  kicker: Localized
  items: CreditItem[]
}

export interface CtaContent {
  title: Localized
  body: Localized
  email: string
}

export interface HomePageContent {
  hero: HeroContent
  about: AboutContent
  principles: PrincipleItem[]
  studio: StudioSection
  room: RoomContent
  live: LiveSection
  cta: CtaContent
}

export type SitePageContent = {
  home: HomePageContent
}

export interface ContentDocument<P extends SitePageId = SitePageId> {
  _id?: ObjectId
  page: P
  content: SitePageContent[P]
  updatedAt: string
}

/* ── Legacy shapes, read-only ──────────────────────────────────────────────
   Kept so the admin can pull pre-redesign content into the new model once.  */

export interface LegacyWorkArtist {
  name: string
  description: string
  roles: string[]
  image: string
  spotify_id?: string
  spotify_url?: string
}

export interface LegacyContent {
  home?: { headline?: string; subheadline?: string; keyValues?: { title: string; description: string }[] }
  work?: { artists?: LegacyWorkArtist[] }
  bio?: { title?: string; image?: string; paragraph1?: string; paragraph2?: string }
  contact?: { heading?: string; subtext?: string }
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

/** Reads a pre-redesign document. Returns the raw stored content, unvalidated. */
export async function getLegacyPageContent(
  page: LegacySitePageId,
): Promise<unknown | null> {
  const db = await getDbInstance()
  if (!db) return null

  const collection = db.collection(COLLECTION_NAME)
  const doc = await collection.findOne({ page })
  return doc?.content ?? null
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
