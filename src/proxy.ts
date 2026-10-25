import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all routes except API routes, Next.js internals, and static files —
  // including the file-based icons and share images, which live outside [locale].
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|images).*)',
  ],
}
