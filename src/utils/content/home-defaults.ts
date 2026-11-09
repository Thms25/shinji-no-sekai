import type {
  CreditItem,
  HomePageContent,
  LegacyContent,
  Localized,
  PrincipleItem,
  ProjectItem,
} from '@/utils/db/content'

export type SiteLocale = 'en' | 'fr'

/**
 * Link-preview image: a square crop of the default About portrait (WhatsApp and
 * iMessage show previews square). Static, so it does not follow admin uploads.
 */
export const SHARE_IMAGE = { url: '/images/og-portrait.jpg', width: 377, height: 377 }

/**
 * Fallback copy for the whole public page. Used whenever the `home` document is
 * missing a field — on a fresh database this is exactly what the site renders, and
 * it is what the admin editor seeds its forms from.
 */
export const DEFAULT_HOME_CONTENT: HomePageContent = {
  hero: {
    kicker: { en: 'Brussels · Studio & stage', fr: 'Bruxelles · Studio & scène' },
    nameLead: 'Shinji',
    nameAccent: 'Hashimoto',
    role: {
      en: 'Recording / Mixing / FOH Engineer',
      fr: 'Prise de son / Mixage / Ingénieur façade',
    },
  },

  about: {
    label: { en: 'About', fr: 'À propos' },
    lead: {
      en: "I'm Shinji Hashimoto, a Brussels-based sound engineer who started building studios out of bedroom furniture at 15 and never really stopped.",
      fr: "Je suis Shinji Hashimoto, ingénieur du son basé à Bruxelles. J'ai commencé à bricoler des studios avec des meubles de chambre à 15 ans, et je n'ai jamais vraiment arrêté.",
    },
    paragraph1: {
      en: "Since then, I've moved between recording studios and live stages — working with artists like Lous and the Yakuza, Dinos, PNL, Pierre de Maere, Krisy and Sofiane Pamart, hitting venues like the Olympia, La Cigale and the Ancienne Belgique, and shaping sound for global projects through NoizBoyz alongside Louis Vuitton, Moncler, Snoop Dogg and Tomorrowland.",
      fr: "Depuis, je navigue entre studios d'enregistrement et scènes — avec des artistes comme Lous and the Yakuza, Dinos, PNL, Pierre de Maere, Krisy et Sofiane Pamart, dans des salles comme l'Olympia, la Cigale et l'Ancienne Belgique, et sur des projets internationaux via NoizBoyz aux côtés de Louis Vuitton, Moncler, Snoop Dogg et Tomorrowland.",
    },
    paragraph2: {
      en: "Some of those connections have grown into something deeper. Since 2023 I've been Lous and the Yakuza's engineer across all her musical creation, and I've been with Sofiane Pamart since his fourth album MOVIE. What drives me isn't the technical side — it's the people, the trust, and the shared vision it takes to make something real.",
      fr: "Certaines de ces rencontres sont devenues plus profondes. Depuis 2023, je suis l'ingénieur de Lous and the Yakuza sur toute sa création musicale, et j'accompagne Sofiane Pamart depuis son quatrième album MOVIE. Ce qui me motive n'est pas la technique — ce sont les personnes, la confiance et la vision commune qu'il faut pour faire quelque chose de vrai.",
    },
    image: '/images/portrait.webp',
  },

  principles: [
    {
      title: { en: 'Human connection', fr: 'Connexion humaine' },
      body: { en: 'The prerequisite to everything else.', fr: 'Le préalable à tout le reste.' },
    },
    {
      title: { en: 'Vision first', fr: "La vision d'abord" },
      body: {
        en: 'Understand the story before touching the sound.',
        fr: "Comprendre l'histoire avant de toucher au son.",
      },
    },
    {
      title: { en: 'Full commitment', fr: 'Engagement total' },
      body: {
        en: 'Every project is the only one that counts.',
        fr: 'Chaque projet est le seul qui compte.',
      },
    },
    {
      title: { en: 'Earned trust', fr: 'Confiance méritée' },
      body: {
        en: 'Built slowly, session by session.',
        fr: 'Construite lentement, session après session.',
      },
    },
  ],

  studio: {
    title: { en: 'Selected studio work', fr: 'Travaux studio choisis' },
    linkLabel: { en: 'Recent work on Spotify', fr: 'Travaux récents sur Spotify' },
    linkUrl: 'https://open.spotify.com/',
    moreLabel: { en: 'All projects', fr: 'Tous les projets' },
  },

  projects: [
    {
      id: 'sofiane-pamart-movie',
      title: 'Sofiane Pamart',
      meta: { en: 'Album: Movie — Mixing / Atmos', fr: 'Album : Movie — Mixage / Atmos' },
      year: '2026',
      story: { en: '', fr: '' },
      images: [],
      url: '',
      featured: true,
    },
    {
      id: 'krisy-edward-risky',
      title: 'Krisy',
      meta: { en: 'Album: Edward Risky — Mixing', fr: 'Album : Edward Risky — Mixage' },
      year: '2026',
      story: { en: '', fr: '' },
      images: [],
      url: '',
      featured: true,
    },
    {
      id: 'lous-no-big-deal',
      title: 'Lous & The Yakuza',
      meta: { en: 'EP: No Big Deal — Recording', fr: 'EP : No Big Deal — Prise de son' },
      year: '2025',
      story: { en: '', fr: '' },
      images: [],
      url: '',
      featured: true,
    },
  ],

  projectsPage: {
    kicker: { en: 'Journal · Studio & stage', fr: 'Journal · Studio & scène' },
    title: { en: 'Projects', fr: 'Projets' },
    intro: {
      en: "Records, tours and the sessions in between, in the order I'd tell them.",
      fr: "Des disques, des tournées et les sessions entre les deux, dans l'ordre où je les raconterais.",
    },
  },

  room: {
    title: { en: 'The room', fr: 'Le studio' },
    body: {
      en: 'Fully in the box. Kii Three monitors, an RME converter, and ears I have spent years calibrating to them. Nothing here is precious — I can mix, print stems and deliver a finished record from anywhere.',
      fr: "Tout en numérique, dans la boîte. Des Kii Three, un convertisseur RME, et des oreilles calibrées dessus depuis des années. Rien n'est figé ici — je peux mixer, imprimer les stems et livrer un disque fini d'où que je sois.",
    },
    image: '/images/room.webp',
  },

  live: {
    title: { en: 'Selected live audio work', fr: 'Travaux live choisis' },
    kicker: { en: 'FOH · Monitors · Tours', fr: 'Façade · Retours · Tournées' },
    items: [
      {
        image: '',
        artist: 'Pierre de Maere',
        meta: { en: 'Regarde-Moi Tour — Monitors', fr: 'Regarde-Moi Tour — Retours' },
        year: '2023',
      },
      {
        image: '',
        artist: 'Camille Yembe',
        meta: { en: 'Summer Tour — FOH', fr: 'Summer Tour — Façade' },
        year: '2025',
      },
      {
        image: '',
        artist: 'Krisy',
        meta: { en: 'Edward Risky Tour — FOH', fr: 'Edward Risky Tour — Façade' },
        year: '2025',
      },
      {
        image: '',
        artist: 'Tomorrowland',
        meta: {
          en: 'Broadcast mixing — via NoizBoyz',
          fr: 'Mixage broadcast — via NoizBoyz',
        },
        year: '2023 — 2026',
      },
    ],
  },

  cta: {
    title: { en: "Let's hear what you have", fr: 'Faites-moi écouter' },
    body: {
      en: "Send two tracks. I'll tell you honestly what I'd do with them.",
      fr: "Envoyez deux titres. Je vous dirai honnêtement ce que j'en ferais.",
    },
    email: 'hello@sekai-studios.com',
    instagram: 'https://www.instagram.com/shinji.no.sekai/',
  },
}

export const EMPTY_LOCALIZED: Localized = { en: '', fr: '' }

export const EMPTY_CREDIT_ITEM: CreditItem = {
  image: '',
  artist: '',
  meta: { en: '', fr: '' },
  year: '',
  url: '',
}

/** Latest four-digit year a free-text year names ("2023 — 2026" → 2026); -1 when none. */
export function projectYear(project: ProjectItem): number {
  const years = project.year.match(/\d{4}/g)
  return years ? Math.max(...years.map(Number)) : -1
}

/** How many projects the home page's studio section shows. */
export const MAX_FEATURED_PROJECTS = 3

/** A fresh project with a unique id, for the admin's "add" button. */
export function createProject(): ProjectItem {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  return {
    id,
    title: '',
    meta: { en: '', fr: '' },
    year: String(new Date().getFullYear()),
    story: { en: '', fr: '' },
    images: [],
    url: '',
    featured: false,
  }
}

/** The projects the home page shows: the featured ones, in list order, three at most. */
export function featuredProjects(projects: ProjectItem[]): ProjectItem[] {
  return projects.filter(project => project.featured).slice(0, MAX_FEATURED_PROJECTS)
}

export const EMPTY_PRINCIPLE: PrincipleItem = {
  title: { en: '', fr: '' },
  body: { en: '', fr: '' },
}

/** Roman numerals for the principles list — derived from position, never stored. */
export const PRINCIPLE_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

/* ── Normalisation ─────────────────────────────────────────────────────────── */

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function str(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback
}

function loc(value: unknown, fallback: Localized): Localized {
  if (!isRecord(value)) return fallback
  return { en: str(value.en, fallback.en), fr: str(value.fr, fallback.fr) }
}

function creditItem(value: unknown, fallback: CreditItem): CreditItem {
  const raw = isRecord(value) ? value : {}
  return {
    image: str(raw.image, fallback.image),
    artist: str(raw.artist, fallback.artist),
    meta: loc(raw.meta, fallback.meta),
    year: str(raw.year, fallback.year),
    url: str(raw.url, fallback.url ?? ''),
  }
}

function projectItem(value: unknown, index: number): ProjectItem {
  const raw = isRecord(value) ? value : {}
  const images = Array.isArray(raw.images)
    ? raw.images.filter((src): src is string => typeof src === 'string' && src.length > 0)
    : []
  return {
    id: str(raw.id, '') || `project-${index}`,
    title: str(raw.title, ''),
    meta: loc(raw.meta, EMPTY_LOCALIZED),
    year: str(raw.year, ''),
    story: loc(raw.story, EMPTY_LOCALIZED),
    images,
    url: str(raw.url, ''),
    featured: raw.featured === true,
  }
}

/**
 * Before the projects journal, the home page's studio cards were stored as
 * `studio.items`. A document that has no `projects` yet carries those cards over
 * as featured projects, so the home page looks the same until the next save.
 */
function migrateStudioItems(items: unknown[]): ProjectItem[] {
  return items.map((item, index) => {
    const credit = creditItem(item, EMPTY_CREDIT_ITEM)
    return {
      id: `studio-${index}`,
      title: credit.artist,
      meta: credit.meta,
      year: credit.year,
      story: { ...EMPTY_LOCALIZED },
      images: credit.image ? [credit.image] : [],
      url: credit.url ?? '',
      featured: index < MAX_FEATURED_PROJECTS,
    }
  })
}

/**
 * A stored list replaces the default list wholesale (so items can be deleted), but
 * each item is still filled in field by field. An absent list falls back entirely.
 */
function list<T>(value: unknown, fallback: T[], map: (item: unknown) => T): T[] {
  return Array.isArray(value) ? value.map(map) : fallback
}

/**
 * Merges whatever is stored over {@link DEFAULT_HOME_CONTENT}. Every field is
 * checked individually so a partial, stale or hand-edited document still renders.
 */
export function normalizeHomeContent(raw: unknown): HomePageContent {
  const d = DEFAULT_HOME_CONTENT
  if (!isRecord(raw)) return d

  const hero = isRecord(raw.hero) ? raw.hero : {}
  const about = isRecord(raw.about) ? raw.about : {}
  const studio = isRecord(raw.studio) ? raw.studio : {}
  const projectsPage = isRecord(raw.projectsPage) ? raw.projectsPage : {}
  const projects = Array.isArray(raw.projects)
    ? raw.projects.map(projectItem)
    : Array.isArray(studio.items)
      ? migrateStudioItems(studio.items)
      : d.projects
  const room = isRecord(raw.room) ? raw.room : {}
  const live = isRecord(raw.live) ? raw.live : {}
  const cta = isRecord(raw.cta) ? raw.cta : {}

  return {
    hero: {
      kicker: loc(hero.kicker, d.hero.kicker),
      nameLead: str(hero.nameLead, d.hero.nameLead),
      nameAccent: str(hero.nameAccent, d.hero.nameAccent),
      role: loc(hero.role, d.hero.role),
    },
    about: {
      label: loc(about.label, d.about.label),
      lead: loc(about.lead, d.about.lead),
      paragraph1: loc(about.paragraph1, d.about.paragraph1),
      paragraph2: loc(about.paragraph2, d.about.paragraph2),
      image: str(about.image, d.about.image),
    },
    principles: list(raw.principles, d.principles, item => {
      const p = isRecord(item) ? item : {}
      return {
        title: loc(p.title, EMPTY_PRINCIPLE.title),
        body: loc(p.body, EMPTY_PRINCIPLE.body),
      }
    }),
    studio: {
      title: loc(studio.title, d.studio.title),
      linkLabel: loc(studio.linkLabel, d.studio.linkLabel),
      linkUrl: str(studio.linkUrl, d.studio.linkUrl),
      moreLabel: loc(studio.moreLabel, d.studio.moreLabel),
    },
    projects,
    projectsPage: {
      kicker: loc(projectsPage.kicker, d.projectsPage.kicker),
      title: loc(projectsPage.title, d.projectsPage.title),
      intro: loc(projectsPage.intro, d.projectsPage.intro),
    },
    room: {
      title: loc(room.title, d.room.title),
      body: loc(room.body, d.room.body),
      image: str(room.image, d.room.image),
    },
    live: {
      title: loc(live.title, d.live.title),
      kicker: loc(live.kicker, d.live.kicker),
      items: list(live.items, d.live.items, item => creditItem(item, EMPTY_CREDIT_ITEM)),
    },
    cta: {
      title: loc(cta.title, d.cta.title),
      body: loc(cta.body, d.cta.body),
      email: str(cta.email, d.cta.email),
      instagram: str(cta.instagram, d.cta.instagram),
    },
  }
}

/* ── One-off migration from the pre-redesign documents ─────────────────────── */

/**
 * Folds the old per-page documents (`home`, `bio`, `work`) into the new single
 * document. Only used by the admin editor, and only when no `home.hero` exists yet:
 * it gives the editor the user's real content to review and save, rather than
 * silently discarding it. Old copy was single-language, so it seeds both locales.
 */
export function migrateLegacyHome(legacy: LegacyContent): Partial<HomePageContent> {
  const both = (value: string): Localized => ({ en: value, fr: value })
  const patch: Partial<HomePageContent> = {}

  if (legacy.home?.keyValues?.length) {
    patch.principles = legacy.home.keyValues.map(kv => ({
      title: both(kv.title),
      body: both(kv.description),
    }))
  }

  if (legacy.bio) {
    patch.about = {
      ...DEFAULT_HOME_CONTENT.about,
      ...(legacy.bio.paragraph1 ? { paragraph1: both(legacy.bio.paragraph1) } : {}),
      ...(legacy.bio.paragraph2 ? { paragraph2: both(legacy.bio.paragraph2) } : {}),
      ...(legacy.bio.image ? { image: legacy.bio.image } : {}),
    }
  }

  if (legacy.work?.artists?.length) {
    patch.projects = legacy.work.artists.map((artist, index) => ({
      id: `legacy-${index}`,
      title: artist.name ?? '',
      meta: both(artist.description ?? (artist.roles ?? []).join(' · ')),
      year: '',
      story: { en: '', fr: '' },
      images: artist.image ? [artist.image] : [],
      url:
        artist.spotify_url ||
        (artist.spotify_id ? `https://open.spotify.com/artist/${artist.spotify_id}` : ''),
      featured: index < MAX_FEATURED_PROJECTS,
    }))
  }

  if (legacy.contact?.heading || legacy.contact?.subtext) {
    patch.cta = {
      ...DEFAULT_HOME_CONTENT.cta,
      ...(legacy.contact.heading ? { title: both(legacy.contact.heading) } : {}),
      ...(legacy.contact.subtext ? { body: both(legacy.contact.subtext) } : {}),
    }
  }

  return patch
}
