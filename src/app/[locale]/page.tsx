import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import HomeView from '@/components/home/HomeView'
import { getPageContent } from '@/utils/db/content'
import { normalizeHomeContent, type SiteLocale } from '@/utils/content/home-defaults'
import { identityGraph, jsonLd, pageMetadata, SEO_COPY } from '@/lib/seo'

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

export async function generateMetadata(): Promise<Metadata> {
  const { siteLocale } = await loadHome()
  return pageMetadata({
    locale: siteLocale,
    path: '/',
    title: SEO_COPY.home.title[siteLocale],
    description: SEO_COPY.home.description[siteLocale],
  })
}

export default async function Home() {
  const { siteLocale, content } = await loadHome()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(identityGraph(content, siteLocale)) }}
      />
      <HomeView content={content} locale={siteLocale} />
    </>
  )
}
