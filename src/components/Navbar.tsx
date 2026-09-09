'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { useSmoothScroll } from '@/components/SmoothScrollProvider'

const SECTIONS = ['about', 'studio', 'room', 'live'] as const

export default function Navbar() {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const { scrollTo } = useSmoothScroll()

  // Section anchors only mean something on the single-page site; the admin and
  // artist-portal routes get the bare brand + locale bar.
  const isHome = pathname === '/'

  return (
    // On the single-page site the bar floats over the hero; elsewhere it sits in the
    // flow so it can never cover the top of an admin or portal screen.
    <header
      className={
        isHome
          ? 'fixed inset-x-0 top-0 z-50 lg:px-7 lg:pt-4.5'
          : 'sticky top-0 z-50 border-b border-border'
      }
    >
      <nav
        className={`flex items-center justify-between bg-background/78 px-5 py-3.5 backdrop-blur-lg ${
          isHome ? 'lg:rounded-full lg:px-7.5 lg:shadow-[0_8px_30px_rgba(59,47,34,.08)]' : 'lg:px-8'
        }`}
      >
        <Link
          href="/"
          className="font-title text-[19px] tracking-[-.01em] transition-opacity hover:opacity-60 lg:text-[22px]"
        >
          Shinji No Sekai
        </Link>

        {isHome && (
          <div className="font-caption hidden gap-9 text-[11px] uppercase tracking-[.18em] text-[#6B6459] lg:flex">
            {SECTIONS.map(section => (
              <a
                key={section}
                href={`#${section}`}
                onClick={event => {
                  // Keep the href for middle-click, copy-link and no-JS; take over
                  // the plain click so the jump is damped like the rest of the page.
                  if (event.metaKey || event.ctrlKey || event.shiftKey) return
                  event.preventDefault()
                  scrollTo(`#${section}`)
                }}
                className="transition-opacity hover:opacity-60"
              >
                {t(section)}
              </a>
            ))}
          </div>
        )}

        <LocaleSwitcher />
      </nav>
    </header>
  )
}
