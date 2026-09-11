'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useTransition } from 'react'

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
] as const

type LocaleCode = (typeof LOCALES)[number]['code']

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
    <div className="font-caption flex items-center gap-1.5">
      {LOCALES.map(({ code, label }) => {
        const isActive = locale === code
        return (
          <button
            key={code}
            onClick={() => handleSwitch(code)}
            disabled={isPending}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`Switch to ${label}`}
            className={`rounded-full px-3 py-1.5 text-[10px] tracking-[.18em] transition-colors duration-400 ${
              isActive
                ? 'bg-primary text-foreground'
                : 'bg-transparent text-secondary hover:text-foreground'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
