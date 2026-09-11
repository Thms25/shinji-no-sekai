'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="font-caption flex items-center justify-between px-6.5 pt-5 pb-8 text-[11px] uppercase tracking-[.2em] text-secondary lg:px-11">
      <span>© {new Date().getFullYear()} Shinji No Sekai</span>
      <span>{t('location')}</span>
    </footer>
  )
}
