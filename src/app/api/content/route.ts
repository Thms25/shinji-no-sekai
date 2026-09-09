import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import {
  getPageContent,
  getLegacyPageContent,
  upsertPageContent,
  type SitePageId,
  type LegacySitePageId,
  type SitePageContent,
} from '@/utils/db/content'

const LEGACY_PAGES: LegacySitePageId[] = ['work', 'bio', 'contact']

function isLegacyPage(page: string): page is LegacySitePageId {
  return (LEGACY_PAGES as string[]).includes(page)
}

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables')
}

const JWT_SECRET_VALUE: string = JWT_SECRET

interface JwtPayload {
  userId: string
  email: string
  role: 'admin' | 'artist'
}

function getUserFromRequest(req: NextRequest): JwtPayload | null {
  try {
    const token = req.cookies.get('auth')?.value
    if (!token) return null
    const decoded = jwt.verify(token, JWT_SECRET_VALUE) as JwtPayload
    return decoded
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pageParam = searchParams.get('page')

  if (!pageParam) {
    return NextResponse.json(
      { error: 'Missing required query parameter "page".' },
      { status: 400 },
    )
  }

  // Pre-redesign documents stay readable so the admin editor can migrate them.
  if (isLegacyPage(pageParam)) {
    const content = await getLegacyPageContent(pageParam)
    return NextResponse.json({ page: pageParam, content, updatedAt: null }, { status: 200 })
  }

  if (pageParam !== 'home') {
    return NextResponse.json({ error: `Unknown page "${pageParam}".` }, { status: 400 })
  }

  const doc = await getPageContent('home')

  return NextResponse.json(
    {
      page: 'home',
      content: doc?.content ?? null,
      updatedAt: doc?.updatedAt ?? null,
    },
    { status: 200 },
  )
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { page?: SitePageId; content?: SitePageContent[SitePageId] }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 },
    )
  }

  const { page, content } = body

  if (!page || !content) {
    return NextResponse.json(
      { error: 'Missing required fields "page" and/or "content".' },
      { status: 400 },
    )
  }

  if (page !== 'home') {
    return NextResponse.json(
      { error: 'Only the "home" document is writable.' },
      { status: 400 },
    )
  }

  const updated = await upsertPageContent(page, content as never)

  return NextResponse.json(
    {
      page,
      content: updated?.content ?? content,
      updatedAt: updated?.updatedAt ?? new Date().toISOString(),
    },
    { status: 200 },
  )
}

