import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type Locale = 'en' | 'fr'

function parsePreferredLocale(acceptLanguage: string): Locale {
  const entries = acceptLanguage
    .split(',')
    .map(entry => {
      const [lang, q] = entry.trim().split(';')
      const quality = q ? parseFloat(q.replace('q=', '')) : 1
      return { lang: lang.trim().toLowerCase(), quality: isNaN(quality) ? 1 : quality }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { lang } of entries) {
    if (lang.startsWith('fr')) return 'fr'
    if (lang.startsWith('en')) return 'en'
  }

  return 'en'
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Respect an already-set locale cookie (user's explicit choice)
  if (request.cookies.has('locale')) return response

  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const locale = parsePreferredLocale(acceptLanguage)

  response.cookies.set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    httpOnly: false, // readable by client JS for the context
  })

  return response
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals, static assets, and admin
    '/((?!api|_next/static|_next/image|favicon\\.ico|admin).*)',
  ],
}
