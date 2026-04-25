'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useTransition } from 'react'

const LOCALES = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
] as const

type LocaleCode = 'fr' | 'en'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const handleSwitch = (code: LocaleCode) => {
    if (code === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: code })
    })
  }

  return (
    <div className="flex items-center font-caption text-sm tracking-widest">
      {LOCALES.map(({ code, label }, i) => (
        <span key={code} className="flex items-center">
          {i > 0 && <span className="mx-2 text-border select-none">·</span>}
          <button
            onClick={() => handleSwitch(code)}
            disabled={isPending}
            className={`transition-colors duration-150 ${
              locale === code
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label={`Switch to ${label}`}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  )
}
