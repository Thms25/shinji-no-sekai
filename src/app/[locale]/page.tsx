import { getLocale } from 'next-intl/server'
import HomeView from '@/components/home/HomeView'
import { getPageContent } from '@/utils/db/content'
import { normalizeHomeContent, type SiteLocale } from '@/utils/content/home-defaults'

// The page is driven by the editable `home` document, so it must not be cached
// at build time — an admin save has to show up on the next request.
export const dynamic = 'force-dynamic'

export default async function Home() {
  const locale = await getLocale()
  const siteLocale: SiteLocale = locale === 'en' ? 'en' : 'fr'

  // A missing document (or an unreachable database) falls back to the defaults,
  // so the site always renders its full content.
  const doc = await getPageContent('home')
  const content = normalizeHomeContent(doc?.content)

  return <HomeView content={content} locale={siteLocale} />
}
