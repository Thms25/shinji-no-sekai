'use client'

import { useLocale } from '@/contexts/LocaleContext'

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
] as const

export default function Navbar() {
  const { locale, setLocale } = useLocale()

  return (
    <nav className="fixed top-0 right-0 z-50 p-6 sm:p-8">
      <div className="flex items-center font-caption text-sm tracking-widest">
        {LOCALES.map(({ code, label }, i) => (
          <span key={code} className="flex items-center">
            {i > 0 && <span className="mx-2 text-border select-none">·</span>}
            <button
              onClick={() => setLocale(code)}
              className={`transition-colors duration-150 ${
                locale === code
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          </span>
        ))}
      </div>
    </nav>
  )
}
