import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import type { WithId } from 'mongodb'
import { getDb } from '@/lib/mongodb'

const DB_NAME = process.env.MONGODB_DB_NAME || 'Shinji'
const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 },
      )
    }

    const db = await getDb(DB_NAME)
    const users = db.collection('users')

    // findOne can fail due to: whitespace, case sensitivity, or wrong field name.
    // Using trim() and case-insensitive collation to avoid common mismatches.
    const normalizedEmail = email.trim()
    const user = await users.findOne<
      WithId<{ password?: string; role?: string }>
    >(
      { email: normalizedEmail },
      { collation: { locale: 'en', strength: 2 } }, // case-insensitive
    )

    console.log('user:', user ? JSON.stringify(user, null, 2) : null)

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 },
      )
    }

    const payload = {
      userId: user._id.toString(),
      email,
      role: user.role || 'artist',
    }

    const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn: '7d' })

    const res = NextResponse.json({
      user: payload,
    })

    res.cookies.set('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    })

    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Failed to login.' }, { status: 500 })
  }
}
