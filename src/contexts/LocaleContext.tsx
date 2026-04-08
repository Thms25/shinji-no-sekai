'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type Locale = 'en' | 'fr'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function persistLocaleCookie(locale: Locale) {
  const maxAge = 60 * 60 * 24 * 365
  document.cookie = `locale=${locale}; path=/; max-age=${maxAge}; samesite=lax`
}

interface LocaleProviderProps {
  children: ReactNode
  /** Initial locale read from the cookie server-side — avoids flash on first render */
  initialLocale?: Locale
}

export function LocaleProvider({ children, initialLocale = 'en' }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    persistLocaleCookie(next)
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale() must be called inside a <LocaleProvider>')
  return ctx
}
