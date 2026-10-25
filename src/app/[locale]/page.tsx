import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import HomeView from '@/components/home/HomeView'
import { getPageContent } from '@/utils/db/content'
import {
  normalizeHomeContent,
  SHARE_IMAGE,
  type SiteLocale,
} from '@/utils/content/home-defaults'

// The page is driven by the editable `home` document, so it must not be cached
// at build time — an admin save has to show up on the next request.
export const dynamic = 'force-dynamic'

async function loadHome() {
  const locale = await getLocale()
  const siteLocale: SiteLocale = locale === 'en' ? 'en' : 'fr'

  // A missing document (or an unreachable database) falls back to the defaults,
  // so the site always renders its full content.
  const doc = await getPageContent('home').catch(() => null)
  return { siteLocale, content: normalizeHomeContent(doc?.content) }
}

/** Link previews quote the About lead, so the shared text matches the page. */
export async function generateMetadata(): Promise<Metadata> {
  const { siteLocale, content } = await loadHome()
  const description = content.about.lead[siteLocale] || content.about.lead.en

  return {
    description,
    openGraph: {
      type: 'website',
      siteName: 'Sekai Studios',
      title: 'Shinji No Sekai | Audio Engineer',
      description,
      locale: siteLocale === 'fr' ? 'fr_BE' : 'en_GB',
      images: [SHARE_IMAGE],
    },
    twitter: { card: 'summary', description, images: [SHARE_IMAGE.url] },
  }
}

export default async function Home() {
  const { siteLocale, content } = await loadHome()

  return <HomeView content={content} locale={siteLocale} />
}
