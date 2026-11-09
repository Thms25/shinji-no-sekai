import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import ProjectsView from '@/components/projects/ProjectsView'
import { getPageContent } from '@/utils/db/content'
import {
  normalizeHomeContent,
  SHARE_IMAGE,
  type SiteLocale,
} from '@/utils/content/home-defaults'

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
  const pick = (value: { en: string; fr: string }) => value[siteLocale] || value.en
  const title = `${pick(content.projectsPage.title)} | Shinji No Sekai`
  const description = pick(content.projectsPage.intro)
  const cover = content.projects.find(project => project.images.length > 0)?.images[0]

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      siteName: 'Sekai Studios',
      title,
      description,
      locale: siteLocale === 'fr' ? 'fr_BE' : 'en_GB',
      images: [cover ? { url: cover } : SHARE_IMAGE],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ProjectsPage() {
  const { siteLocale, content } = await loadProjects()
  return <ProjectsView content={content} locale={siteLocale} />
}
