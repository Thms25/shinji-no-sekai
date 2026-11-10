import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import ProjectsView from '@/components/projects/ProjectsView'
import { getPageContent } from '@/utils/db/content'
import { normalizeHomeContent, type SiteLocale } from '@/utils/content/home-defaults'
import { identityGraph, jsonLd, pageMetadata, projectsGraph, SEO_COPY } from '@/lib/seo'

// Read from the editable `home` document on every request, like the home page,
// so a project saved in the admin shows up straight away.
export const dynamic = 'force-dynamic'

async function loadProjects() {
  const locale = await getLocale()
  const siteLocale: SiteLocale = locale === 'en' ? 'en' : 'fr'
  const doc = await getPageContent('home').catch(() => null)
  return { siteLocale, content: normalizeHomeContent(doc?.content) }
}

export async function generateMetadata(): Promise<Metadata> {
  const { siteLocale, content } = await loadProjects()
  return pageMetadata({
    locale: siteLocale,
    path: '/projects',
    title: SEO_COPY.projects.title[siteLocale],
    description: content.projectsPage.intro[siteLocale] || content.projectsPage.intro.en,
  })
}

export default async function ProjectsPage() {
  const { siteLocale, content } = await loadProjects()
  const graph = [...identityGraph(content, siteLocale), ...projectsGraph(content, siteLocale)]
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <ProjectsView content={content} locale={siteLocale} />
    </>
  )
}
