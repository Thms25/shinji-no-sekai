'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="w-full py-6 border-t border-white/10 bg-background text-center text-sm text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4">
        <p>© {new Date().getFullYear()} Shinji No Sekai. {t('rights')}</p>
      </div>
    </footer>
  )
}
