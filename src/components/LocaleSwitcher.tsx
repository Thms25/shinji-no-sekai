'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useTransition } from 'react'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const otherLocale = locale === 'fr' ? 'en' : 'fr'

  const handleSwitch = () => {
    startTransition(() => {
      router.replace(pathname, { locale: otherLocale })
    })
  }

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      className="px-3 py-1.5 text-xs font-semibold rounded-full border border-white/20 text-muted-foreground hover:text-foreground hover:border-white/40 transition-colors disabled:opacity-40 tracking-widest"
      aria-label={`Switch to ${otherLocale === 'fr' ? 'French' : 'English'}`}
    >
      {otherLocale.toUpperCase()}
    </button>
  )
}
