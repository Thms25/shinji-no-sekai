import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en'] as const,
  defaultLocale: 'fr' as const,
  localePrefix: 'never',
  localeCookie: { name: 'locale', sameSite: 'lax' },
})

export type Locale = (typeof routing.locales)[number]
