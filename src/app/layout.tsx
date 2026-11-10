import type { Metadata } from 'next'
import { Instrument_Serif, Zen_Kaku_Gothic_New, JetBrains_Mono } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import { SHARE_IMAGE } from '@/utils/content/home-defaults'
import { SITE_URL } from '@/lib/seo'
import './globals.css'

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
})

// Zen Kaku Gothic New is a Japanese face: Google slices it into ~100 unicode-range
// files per weight, and next/font emits a <link rel="preload"> for every one of them
// (241 on the home page, 4.2 MB). Opting out of preload lets the browser fetch only
// the ranges the page actually uses — the latin slice — on demand.
const zenKaku = Zen_Kaku_Gothic_New({
  variable: '--font-zen-kaku',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  preload: false,
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

// Link previews need absolute image URLs, hence `metadataBase`. The tab icons are the
// file-based `icon.png` / `apple-icon.png` next to this layout; the home page
// and projects page set their own titles, descriptions and language URLs (src/lib/seo.ts).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Shinji Hashimoto — Sound Engineer in Brussels | Sekai Studios',
  description:
    'Shinji Hashimoto — recording, mixing and FOH engineer based in Brussels. Studio and stage.',
  openGraph: {
    type: 'website',
    siteName: 'Sekai Studios',
    title: 'Shinji Hashimoto — Sound Engineer in Brussels | Sekai Studios',
    images: [SHARE_IMAGE],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The page's own language (from its URL), not the visitor's cookie: an English
  // page is lang="en" even on a first visit.
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <body
        className={`${instrumentSerif.variable} ${zenKaku.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  )
}
