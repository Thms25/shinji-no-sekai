import type { MetadataRoute } from 'next'
import { getPageContent } from '@/utils/db/content'
import { normalizeHomeContent } from '@/utils/content/home-defaults'
import { absolute, LOCALES, localePath, orderedProjects, SITE_URL } from '@/lib/seo'

// Follows the admin: a new project's cover is listed on the next request.
export const dynamic = 'force-dynamic'

/** Both public pages in both languages, each pointing at its other language. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const doc = await getPageContent('home').catch(() => null)
  const content = normalizeHomeContent(doc?.content)
  const lastModified = doc?.updatedAt ? new Date(doc.updatedAt) : undefined
  const covers = orderedProjects(content.projects)
    .map(project => project.images[0])
    .filter(Boolean)
    .map(absolute)

  const pages = [
    { path: '/', priority: 1, images: [absolute(content.about.image)] },
    { path: '/projects', priority: 0.8, images: covers },
  ]

  return pages.flatMap(({ path, priority, images }) =>
    LOCALES.map(locale => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
      images,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map(other => [other, `${SITE_URL}${localePath(other, path)}`]),
        ),
      },
    })),
  )
}
