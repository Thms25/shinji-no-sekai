import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import {
  getPageContent,
  upsertPageContent,
  type SitePageId,
  type SitePageContent,
} from '@/utils/db/content'

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
  const pageParam = searchParams.get('page') as SitePageId | null

  if (!pageParam) {
    return NextResponse.json(
      { error: 'Missing required query parameter "page".' },
      { status: 400 },
    )
  }

  const doc = await getPageContent(pageParam)

  return NextResponse.json(
    {
      page: pageParam,
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

