import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en'] as const,
  defaultLocale: 'fr' as const,
  // French, the default, at the bare paths (/ and /projects); English under /en,
  // so each language has its own URL that search engines can index.
  localePrefix: 'as-needed',
  localeCookie: { name: 'locale', sameSite: 'lax' },
})

export type Locale = (typeof routing.locales)[number]
