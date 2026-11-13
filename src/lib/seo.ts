import type { Metadata } from 'next'
import type { CreditLine, HomePageContent, Localized, ProjectItem } from '@/utils/db/content'
import { emptyCreditLine, SHARE_IMAGE, type SiteLocale } from '@/utils/content/home-defaults'

/**
 * Search and AI-search plumbing shared by the pages, the sitemap and llms.txt.
 * Nothing here is shown on the page: it is how the site describes itself to
 * crawlers (canonical and language URLs, titles, schema.org JSON-LD).
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sekai-studios.com').replace(
  /\/$/,
  '',
)

export const LOCALES: SiteLocale[] = ['fr', 'en']

/** `/projects` in French, `/en/projects` in English (`localePrefix: 'as-needed'`). */
export function localePath(locale: SiteLocale, path: string) {
  if (locale === 'fr') return path
  return path === '/' ? '/en' : `/en${path}`
}

export const absolute = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path}`)

/** This page's own URL, its other language, and French as the default. */
export function alternates(locale: SiteLocale, path: string): Metadata['alternates'] {
  return {
    canonical: localePath(locale, path),
    languages: {
      fr: localePath('fr', path),
      en: localePath('en', path),
      'x-default': localePath('fr', path),
    },
  }
}

export const OG_LOCALE: Record<SiteLocale, string> = { fr: 'fr_BE', en: 'en_GB' }

const pick = (value: Localized, locale: SiteLocale) => value[locale] || value.en

/** Titles and descriptions written for search, one set per language. */
export const SEO_COPY = {
  home: {
    title: {
      fr: 'Shinji Hashimoto — Ingénieur du son à Bruxelles | Sekai Studios',
      en: 'Shinji Hashimoto — Sound Engineer in Brussels | Sekai Studios',
    },
    description: {
      fr: 'Shinji Hashimoto, ingénieur du son à Bruxelles : prise de son, mixage, Dolby Atmos et façade (FOH) pour Lous and the Yakuza, Sofiane Pamart, Krisy, Dinos et PNL.',
      en: 'Shinji Hashimoto, sound engineer in Brussels: recording, mixing, Dolby Atmos and front-of-house (FOH) for Lous and the Yakuza, Sofiane Pamart, Krisy, Dinos and PNL.',
    },
  },
  projects: {
    title: {
      fr: 'Projets — Albums, EP et singles mixés et enregistrés | Shinji Hashimoto',
      en: 'Projects — Albums, EPs and singles recorded and mixed | Shinji Hashimoto',
    },
  },
} as const

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
}: {
  locale: SiteLocale
  path: string
  title: string
  description: string
  image?: { url: string; width?: number; height?: number }
}): Metadata {
  const share = image ?? SHARE_IMAGE
  return {
    title: { absolute: title },
    description,
    alternates: alternates(locale, path),
    openGraph: {
      type: 'website',
      siteName: 'Sekai Studios',
      url: localePath(locale, path),
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter(l => l !== locale).map(l => OG_LOCALE[l]),
      images: [share],
    },
    twitter: { card: 'summary_large_image', title, description, images: [share.url] },
  }
}

/* ── Projects, read for machines ──────────────────────────────────────────── */

const RELEASE_TYPES = {
  album: 'AlbumRelease',
  ep: 'EPRelease',
  single: 'SingleRelease',
} as const

/** Reads a credit written the admin's way, "Album: MOVIE", into its kind and name. */
export function parseRelease(credit: string) {
  const match = credit.match(/^\s*(album|ep|single)\s*:\s*(.+?)\s*$/i)
  if (!match) return { kind: null, release: credit.trim() }
  return { kind: match[1].toLowerCase() as keyof typeof RELEASE_TYPES, release: match[2] }
}

/** Projects in the order the page shows them: the home-page picks, then the rest. */
export const orderedProjects = (projects: ProjectItem[]) => [
  ...projects.filter(project => project.featured),
  ...projects.filter(project => !project.featured),
]

/* ── schema.org ───────────────────────────────────────────────────────────── */

const PERSON_ID = `${SITE_URL}/#shinji`
const STUDIO_ID = `${SITE_URL}/#studio`
const WEBSITE_ID = `${SITE_URL}/#website`

/** Who and what the site is about: the engineer, his studio, the site. */
export function identityGraph(content: HomePageContent, locale: SiteLocale) {
  const { hero, about, cta, studio } = content
  const name = `${hero.nameLead} ${hero.nameAccent}`.trim()
  const sameAs = [cta.instagram, studio.linkUrl].filter(
    url => url && !/^https:\/\/open\.spotify\.com\/?$/.test(url),
  )

  return [
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name,
      jobTitle: locale === 'fr' ? 'Ingénieur du son' : 'Sound engineer',
      description: pick(about.lead, locale),
      image: absolute(about.image),
      url: `${SITE_URL}${localePath(locale, '/')}`,
      email: cta.email || undefined,
      sameAs,
      worksFor: { '@id': STUDIO_ID },
      homeLocation: {
        '@type': 'Place',
        address: { '@type': 'PostalAddress', addressLocality: 'Brussels', addressCountry: 'BE' },
      },
      knowsLanguage: ['fr', 'en'],
      knowsAbout: [
        'Recording',
        'Mixing',
        'Dolby Atmos mixing',
        'Front-of-house (FOH) engineering',
        'Live sound',
        'Music production',
      ],
    },
    {
      '@type': 'ProfessionalService',
      '@id': STUDIO_ID,
      name: 'Sekai Studios',
      legalName: 'Sekai Studios SRL',
      url: SITE_URL,
      // The site's favicon (src/app/icon.png), the brand mark used everywhere.
      logo: absolute('/icon.png'),
      image: absolute(SHARE_IMAGE.url),
      email: cta.email || undefined,
      founder: { '@id': PERSON_ID },
      address: { '@type': 'PostalAddress', addressLocality: 'Brussels', addressCountry: 'BE' },
      areaServed: ['Brussels', 'Belgium', 'France', 'Europe'],
      knowsLanguage: ['fr', 'en'],
      description: pick(SEO_COPY.home.description, locale),
      sameAs,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: locale === 'fr' ? 'Services' : 'Services',
        itemListElement: (locale === 'fr'
          ? ['Prise de son', 'Mixage', 'Mixage Dolby Atmos', 'Ingénieur façade (FOH)']
          : ['Recording', 'Mixing', 'Dolby Atmos mixing', 'Front-of-house (FOH) engineering']
        ).map(service => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: service } })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: 'Sekai Studios',
      inLanguage: ['fr', 'en'],
      publisher: { '@id': STUDIO_ID },
      about: { '@id': PERSON_ID },
    },
  ]
}

/** One credit line's release, credited to Shinji in the role the line names. */
function projectNode(project: ProjectItem, line: CreditLine, locale: SiteLocale) {
  const credit = parseRelease(line.credit.en || line.credit.fr)
  const role = pick(line.role, locale)
  const text = [pick(line.credit, locale), role].filter(Boolean).join(' — ')
  const story = pick(project.story, locale)
  const base = {
    image: project.images.map(absolute),
    url: project.url || undefined,
    datePublished: project.year || undefined,
    description: [[project.title, text].filter(Boolean).join(' — '), story]
      .filter(Boolean)
      .join('. '),
    contributor: {
      '@type': 'Role',
      roleName: role || undefined,
      contributor: { '@id': PERSON_ID },
    },
  }

  if (!credit.kind) {
    return { '@type': 'CreativeWork', name: project.title, ...base }
  }
  return {
    '@type': 'MusicAlbum',
    name: credit.release,
    albumReleaseType: `https://schema.org/${RELEASE_TYPES[credit.kind]}`,
    byArtist: { '@type': 'MusicGroup', name: project.title },
    ...base,
  }
}

/** The projects page: every release, in the page's order, as a list. */
export function projectsGraph(content: HomePageContent, locale: SiteLocale) {
  // A project with several credit lines lists each release on its own.
  const releases = orderedProjects(content.projects).flatMap(project => {
    const lines = project.credits.filter(line =>
      [line.credit.en, line.credit.fr, line.role.en, line.role.fr].some(text => text.trim()),
    )
    return (lines.length > 0 ? lines : [emptyCreditLine()]).map(line =>
      projectNode(project, line, locale),
    )
  })
  const url = `${SITE_URL}${localePath(locale, '/projects')}`
  return [
    {
      '@type': 'CollectionPage',
      '@id': `${url}#page`,
      url,
      name: pick(content.projectsPage.title, locale),
      description: pick(content.projectsPage.intro, locale),
      inLanguage: locale,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': PERSON_ID },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: releases.length,
        itemListElement: releases.map((release, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: release,
        })),
      },
    },
  ]
}

/** A `<script type="application/ld+json">` body, safe to inline. */
export function jsonLd(graph: object[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
}
