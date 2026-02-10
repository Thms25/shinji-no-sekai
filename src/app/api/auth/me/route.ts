import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables')
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth')?.value
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: 'admin' | 'artist'
    }

    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    })
  } catch (err) {
    console.error('Auth me error:', err)
    return NextResponse.json({ user: null }, { status: 401 })
  }
}

