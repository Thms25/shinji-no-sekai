'use client'

import { useLocale } from 'next-intl'
import { useEffect } from 'react'

/**
 * Keeps `<html lang>` on the page's language after the switcher changes it. The
 * server sets it on every full load; a client-side switch keeps the root layout,
 * so this updates the attribute in place.
 */
export function HtmlLang() {
  const locale = useLocale()
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])
  return null
}
