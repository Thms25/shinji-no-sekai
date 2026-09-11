# next-intl JSON i18n Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace MongoDB-fetched site content on public pages with `next-intl` JSON translation files, supporting `fr` (default) and `en` locales, with a locale toggle in the Navbar and clean URLs (no locale prefix).

**Architecture:** All non-API routes move under `src/app/[locale]/`. next-intl middleware reads a `locale` cookie, rewrites requests internally to the `[locale]` segment, and keeps URLs clean via `localePrefix: 'never'`. The root layout becomes minimal (html/body only, reads locale cookie for `lang`); the `[locale]/layout.tsx` adds `NextIntlClientProvider`, `AuthProvider`, `Navbar`, and `Footer`.

**Tech Stack:** next-intl v4, Next.js 16 App Router, TypeScript, JSON translation files at `messages/en.json` + `messages/fr.json`.

---

## File Map

### New files
| Path | Responsibility |
|------|---------------|
| `messages/en.json` | English translations (all pages + nav/footer) |
| `messages/fr.json` | French translations |
| `i18n/routing.ts` | next-intl routing config (locales, defaultLocale, localePrefix, localeCookie) |
| `i18n/request.ts` | Server-side next-intl config (message loading) |
| `i18n/navigation.ts` | Typed Link/useRouter/usePathname from next-intl |
| `src/middleware.ts` | next-intl middleware — locale detection from cookie |
| `src/app/[locale]/layout.tsx` | Locale layout: NextIntlClientProvider + Navbar + Footer + AuthProvider |
| `src/components/LocaleSwitcher.tsx` | FR/EN toggle button (sets locale cookie via next-intl router) |

### Modified files
| Path | Change |
|------|--------|
| `next.config.ts` | Wrap with `withNextIntl` plugin |
| `src/app/layout.tsx` | Strip to html/body/fonts only; read locale from cookie for `lang` attr |
| `src/components/Navbar.tsx` | Add `<LocaleSwitcher />` |
| `src/app/[locale]/page.tsx` | *(moved from `src/app/page.tsx`)* — use `useTranslations('home')`, remove DB fetch |
| `src/app/[locale]/bio/page.tsx` | *(moved from `src/app/bio/page.tsx`)* — use `useTranslations('bio')`, remove DB fetch |
| `src/app/[locale]/work/page.tsx` | *(moved from `src/app/work/page.tsx`)* — use `useTranslations('work')`, keep artist data from DB |
| `src/app/[locale]/contact/page.tsx` | *(moved from `src/app/contact/page.tsx`)* — use `useTranslations('contact')`, remove DB fetch |

### Moved files (no content change)
All of the following are copied verbatim to `src/app/[locale]/` then their originals deleted:
- `src/app/login/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/site-content/` (all 7 files)
- `src/app/admin/artist/[id]/page.tsx`
- `src/app/admin/upload/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/track/[id]/` (all 4 files)

---

## Task 1: Install next-intl and update next.config.ts

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Install next-intl**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && npm install next-intl
```

Expected: next-intl added to `package.json` dependencies, no errors.

- [ ] **Step 2: Update next.config.ts**

Replace entire file with:

```ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  devIndicators: false,
}

export default withNextIntl(nextConfig)
```

- [ ] **Step 3: Commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add package.json package-lock.json next.config.ts && git commit -m "feat: install next-intl"
```

---

## Task 2: Create i18n config files

**Files:**
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Create: `i18n/navigation.ts`

- [ ] **Step 1: Create `i18n/routing.ts`**

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['fr', 'en'] as const,
  defaultLocale: 'fr' as const,
  localePrefix: 'never',
  localeCookie: 'locale',
})

export type Locale = (typeof routing.locales)[number]
```

- [ ] **Step 2: Create `i18n/request.ts`**

```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 3: Create `i18n/navigation.ts`**

```ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
```

- [ ] **Step 4: Commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add i18n/ && git commit -m "feat: add next-intl i18n config and routing"
```

---

## Task 3: Create middleware.ts

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create `src/middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from '../i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all routes except API routes, Next.js internals, and static files
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add src/middleware.ts && git commit -m "feat: add next-intl middleware for locale detection"
```

---

## Task 4: Create message files

**Files:**
- Create: `messages/en.json`
- Create: `messages/fr.json`

- [ ] **Step 1: Create `messages/en.json`**

```json
{
  "nav": {
    "home": "Home",
    "work": "Work",
    "bio": "Bio",
    "contact": "Contact",
    "admin": "Admin",
    "dashboard": "Dashboard",
    "login": "Login",
    "logout": "Logout"
  },
  "footer": {
    "rights": "All rights reserved."
  },
  "home": {
    "headline": "SHINJI NO SEKAI",
    "subheadline": "Audio Engineer & Sound Designer based in Brussels. Crafting immersive sonic experiences.",
    "ctaPrimaryLabel": "View Work",
    "ctaSecondaryLabel": "Contact Me"
  },
  "bio": {
    "title": "Shinji No Sekai",
    "paragraph1": "I am an audio engineer dedicated to finding the perfect sound. My journey began in the analog era and has evolved into the digital realm, blending classic techniques with modern innovation.",
    "paragraph2": "Based in Brussels, I work with artists from around the globe to bring their sonic visions to life. From mixing and mastering to full-scale production, I treat every project with the precision and passion it deserves."
  },
  "work": {
    "heading": "Selected Work",
    "comingSoon": "Projects coming soon. Check back as new work is added.",
    "listenOnSpotify": "Listen on Spotify"
  },
  "contact": {
    "heading": "Get in Touch",
    "subtext": "Ready to start your next project? Send me a message.",
    "nameLabel": "Name",
    "namePlaceholder": "Your name",
    "emailLabel": "Email",
    "emailPlaceholder": "your@email.com",
    "messageLabel": "Message",
    "messagePlaceholder": "Tell me about your project...",
    "sendButton": "Send Message"
  }
}
```

- [ ] **Step 2: Create `messages/fr.json`**

```json
{
  "nav": {
    "home": "Accueil",
    "work": "Travaux",
    "bio": "Bio",
    "contact": "Contact",
    "admin": "Admin",
    "dashboard": "Tableau de bord",
    "login": "Connexion",
    "logout": "Déconnexion"
  },
  "footer": {
    "rights": "Tous droits réservés."
  },
  "home": {
    "headline": "SHINJI NO SEKAI",
    "subheadline": "Ingénieur du son & designer sonore basé à Bruxelles. Créateur d'expériences sonores immersives.",
    "ctaPrimaryLabel": "Voir les travaux",
    "ctaSecondaryLabel": "Me contacter"
  },
  "bio": {
    "title": "Shinji No Sekai",
    "paragraph1": "Je suis ingénieur du son, passionné par la recherche du son parfait. Mon parcours a débuté à l'ère analogique et a évolué vers le numérique, alliant techniques classiques et innovation moderne.",
    "paragraph2": "Basé à Bruxelles, je travaille avec des artistes du monde entier pour donner vie à leurs visions soniques. Du mixage au mastering en passant par la production complète, je traite chaque projet avec la précision et la passion qu'il mérite."
  },
  "work": {
    "heading": "Travaux sélectionnés",
    "comingSoon": "Projets à venir. Revenez bientôt.",
    "listenOnSpotify": "Écouter sur Spotify"
  },
  "contact": {
    "heading": "Contactez-moi",
    "subtext": "Prêt à démarrer votre prochain projet ? Envoyez-moi un message.",
    "nameLabel": "Nom",
    "namePlaceholder": "Votre nom",
    "emailLabel": "Email",
    "emailPlaceholder": "votre@email.com",
    "messageLabel": "Message",
    "messagePlaceholder": "Parlez-moi de votre projet...",
    "sendButton": "Envoyer"
  }
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add messages/ && git commit -m "feat: add en and fr translation message files"
```

---

## Task 5: Update root layout and create [locale] layout

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Replace `src/app/layout.tsx` with minimal version**

This layout now only handles the html/body shell. It reads the `locale` cookie to set the correct `lang` attribute (for SEO). `AuthProvider`, `Navbar`, and `Footer` move to `[locale]/layout.tsx`.

```tsx
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { cookies } from 'next/headers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Shinji No Sekai | Audio Engineer',
  description: 'Modern audio engineering and production services.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value ?? 'fr'

  return (
    <html lang={locale} className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create `src/app/[locale]/layout.tsx`**

```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <Navbar />
        <main className="grow pt-16" suppressHydrationWarning>
          {children}
        </main>
        <Footer />
      </AuthProvider>
    </NextIntlClientProvider>
  )
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add src/app/layout.tsx src/app/[locale]/layout.tsx && git commit -m "feat: restructure layouts for next-intl [locale] segment"
```

---

## Task 6: Move non-public pages under [locale] (no content changes)

These pages are moved verbatim — no translation changes. The purpose is to keep them inside the `[locale]` layout tree (which provides Navbar, Footer, AuthProvider).

**Files to move:**
- `src/app/login/page.tsx` → `src/app/[locale]/login/page.tsx`
- `src/app/admin/page.tsx` → `src/app/[locale]/admin/page.tsx`
- `src/app/admin/site-content/` (all 7 files) → `src/app/[locale]/admin/site-content/`
- `src/app/admin/artist/[id]/page.tsx` → `src/app/[locale]/admin/artist/[id]/page.tsx`
- `src/app/admin/upload/page.tsx` → `src/app/[locale]/admin/upload/page.tsx`
- `src/app/dashboard/page.tsx` → `src/app/[locale]/dashboard/page.tsx`
- `src/app/dashboard/track/[id]/` (all 4 files) → `src/app/[locale]/dashboard/track/[id]/`

- [ ] **Step 1: Create directory structure and copy files**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai

# login
mkdir -p src/app/\[locale\]/login
cp src/app/login/page.tsx src/app/\[locale\]/login/page.tsx

# admin root
mkdir -p src/app/\[locale\]/admin
cp src/app/admin/page.tsx src/app/\[locale\]/admin/page.tsx

# admin site-content
mkdir -p src/app/\[locale\]/admin/site-content
cp src/app/admin/site-content/*.tsx src/app/\[locale\]/admin/site-content/
cp src/app/admin/site-content/*.ts src/app/\[locale\]/admin/site-content/

# admin artist
mkdir -p "src/app/[locale]/admin/artist/[id]"
cp "src/app/admin/artist/[id]/page.tsx" "src/app/[locale]/admin/artist/[id]/page.tsx"

# admin upload
mkdir -p src/app/\[locale\]/admin/upload
cp src/app/admin/upload/page.tsx src/app/\[locale\]/admin/upload/page.tsx

# dashboard
mkdir -p src/app/\[locale\]/dashboard
cp src/app/dashboard/page.tsx src/app/\[locale\]/dashboard/page.tsx

# dashboard track
mkdir -p "src/app/[locale]/dashboard/track/[id]"
cp "src/app/dashboard/track/[id]/"*.tsx "src/app/[locale]/dashboard/track/[id]/"
```

- [ ] **Step 2: Delete original locations**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai
rm -rf src/app/login
rm -rf src/app/admin
rm -rf src/app/dashboard
```

- [ ] **Step 3: Commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add -A && git commit -m "refactor: move admin/login/dashboard pages under [locale] route segment"
```

---

## Task 7: Migrate home page

**Files:**
- Create: `src/app/[locale]/page.tsx` (replaces `src/app/page.tsx`)

- [ ] **Step 1: Create `src/app/[locale]/page.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Home() {
  const t = useTranslations('home')

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-5xl sm:text-7xl font-bold tracking-tighter"
        >
          {t('headline')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-xl text-muted-foreground"
        >
          {t('subheadline')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="flex gap-4 items-center flex-col sm:flex-row"
        >
          <Link
            href="/work"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] hover:text-white dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            {t('ctaPrimaryLabel')}
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-solid border-white/20 transition-colors flex items-center justify-center hover:bg-white/10 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          >
            {t('ctaSecondaryLabel')} <ArrowRight size={16} className="ml-2" />
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Delete old home page**

```bash
rm /Users/thomasallen/Code/Thms25/shinji-no-sekai/src/app/page.tsx
```

- [ ] **Step 3: Commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add -A && git commit -m "feat: migrate home page to next-intl translations"
```

---

## Task 8: Migrate bio page

**Files:**
- Create: `src/app/[locale]/bio/page.tsx` (replaces `src/app/bio/page.tsx`)

- [ ] **Step 1: Create `src/app/[locale]/bio/page.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const BIO_IMAGE = '/images/shinji_home_studio.jpg'

export default function Bio() {
  const t = useTranslations('bio')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="aspect-3/4 bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative"
        >
          <Image
            src={BIO_IMAGE}
            alt={t('title')}
            fill
            className="object-cover absolute inset-0"
          />
        </motion.div>

        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight"
          >
            {t('title')}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4 text-muted-foreground leading-relaxed"
          >
            <p>{t('paragraph1')}</p>
            <p>{t('paragraph2')}</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Delete old bio page**

```bash
rm -rf /Users/thomasallen/Code/Thms25/shinji-no-sekai/src/app/bio
```

- [ ] **Step 3: Commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add -A && git commit -m "feat: migrate bio page to next-intl translations"
```

---

## Task 9: Migrate work page

**Files:**
- Create: `src/app/[locale]/work/page.tsx` (replaces `src/app/work/page.tsx`)

Note: the Work page keeps its DB fetch for artist data (this is dynamic artist portfolio content, not static site copy). Only the UI strings (heading, "coming soon" text, "Listen on Spotify") move to translations.

- [ ] **Step 1: Create `src/app/[locale]/work/page.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { WorkPageContent, WorkArtist } from '@/utils/db/content'

function getSpotifyArtistId(artist: WorkArtist): string | null {
  if (artist.spotify_id) return artist.spotify_id
  if (!artist.spotify_url) return null
  const m = artist.spotify_url.match(/spotify\.com\/artist\/([a-zA-Z0-9]+)/)
  return m ? m[1] : null
}

function ArtistCard({ artist }: { artist: WorkArtist }) {
  const t = useTranslations('work')
  const spotifyLink =
    artist.spotify_url ||
    (artist.spotify_id
      ? `https://open.spotify.com/artist/${artist.spotify_id}`
      : null)
  const spotifyEmbedId = getSpotifyArtistId(artist)

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 flex flex-col gap-4"
    >
      <div className="flex gap-4">
        {artist.image && (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artist.image}
              alt={artist.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-lg font-semibold tracking-tight">{artist.name}</h2>
          {artist.roles && artist.roles.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {artist.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {artist.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {artist.description}
        </p>
      )}

      {spotifyLink && (
        <div className="mt-auto pt-2 space-y-3">
          {spotifyEmbedId && (
            <div className="rounded-xl overflow-hidden bg-[#181818] border border-white/10">
              <iframe
                title={`${artist.name} on Spotify`}
                src={`https://open.spotify.com/embed/artist/${spotifyEmbedId}`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block"
              />
            </div>
          )}
          <Link
            href={spotifyLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80"
          >
            {t('listenOnSpotify')}
          </Link>
        </div>
      )}
    </motion.article>
  )
}

export default function Work() {
  const t = useTranslations('work')
  const [artists, setArtists] = useState<WorkArtist[]>([])

  useEffect(() => {
    fetch('/api/content?page=work', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.content?.artists) setArtists(data.content.artists)
      })
      .catch(console.error)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-12 tracking-tight"
      >
        {t('heading')}
      </motion.h1>

      {artists.length === 0 && (
        <p className="text-muted-foreground">{t('comingSoon')}</p>
      )}

      {artists.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {artists.map((artist, idx) => (
            <ArtistCard key={idx} artist={artist} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Delete old work page**

```bash
rm -rf /Users/thomasallen/Code/Thms25/shinji-no-sekai/src/app/work
```

- [ ] **Step 3: Commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add -A && git commit -m "feat: migrate work page to next-intl translations"
```

---

## Task 10: Migrate contact page

**Files:**
- Create: `src/app/[locale]/contact/page.tsx` (replaces `src/app/contact/page.tsx`)

- [ ] **Step 1: Create `src/app/[locale]/contact/page.tsx`**

```tsx
'use client'

import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Contact() {
  const t = useTranslations('contact')

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{t('heading')}</h1>
          <p className="text-muted-foreground">{t('subtext')}</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {t('nameLabel')}
              </label>
              <input
                id="name"
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder={t('namePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder={t('emailPlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              {t('messageLabel')}
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              placeholder={t('messagePlaceholder')}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-foreground text-background font-medium py-3 rounded-lg hover:bg-[#383838] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            {t('sendButton')} <Send size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Delete old contact page**

```bash
rm -rf /Users/thomasallen/Code/Thms25/shinji-no-sekai/src/app/contact
```

- [ ] **Step 3: Commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add -A && git commit -m "feat: migrate contact page to next-intl translations"
```

---

## Task 11: Create LocaleSwitcher component

**Files:**
- Create: `src/components/LocaleSwitcher.tsx`

- [ ] **Step 1: Create `src/components/LocaleSwitcher.tsx`**

```tsx
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useTransition } from 'react'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const otherLocale = locale === 'fr' ? 'en' : 'fr'

  const handleSwitch = () => {
    startTransition(() => {
      router.replace(pathname, { locale: otherLocale })
    })
  }

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      className="px-3 py-1.5 text-xs font-semibold rounded-full border border-white/20 text-muted-foreground hover:text-foreground hover:border-white/40 transition-colors disabled:opacity-40 tracking-widest"
      aria-label={`Switch to ${otherLocale === 'fr' ? 'French' : 'English'}`}
    >
      {otherLocale.toUpperCase()}
    </button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add src/components/LocaleSwitcher.tsx && git commit -m "feat: add LocaleSwitcher component"
```

---

## Task 12: Update Navbar with locale switcher and translations

**Files:**
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Replace `src/components/Navbar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, role, signOut } = useAuth()
  const t = useTranslations('nav')

  const baseLinks = [
    { href: '/', label: t('home') },
    { href: '/work', label: t('work') },
    { href: '/bio', label: t('bio') },
    { href: '/contact', label: t('contact') },
  ]

  const navLinks = [...baseLinks]
  if (user) {
    if (role === 'admin') {
      navLinks.push({ href: '/admin', label: t('admin') })
    } else {
      navLinks.push({ href: '/dashboard', label: t('dashboard') })
    }
  } else {
    navLinks.push({ href: '/login', label: t('login') })
  }

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <Link
              href="/"
              className="text-xl font-bold tracking-tighter hover:text-primary transition-colors"
            >
              SHINJI NO SEKAI
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => signOut()}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('logout')}
              </button>
            )}
            <div className="ml-4">
              <LocaleSwitcher />
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-background border-b border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-white/10 text-primary'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  signOut()
                  setIsOpen(false)
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                {t('logout')}
              </button>
            )}
            <div className="px-3 py-2">
              <LocaleSwitcher />
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
```

- [ ] **Step 2: Update `src/components/Footer.tsx` to use translations**

```tsx
'use client'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="w-full py-6 border-t border-white/10 bg-background text-center text-sm text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4">
        <p>© {new Date().getFullYear()} Shinji No Sekai. {t('rights')}</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add src/components/Navbar.tsx src/components/Footer.tsx && git commit -m "feat: add locale switcher to navbar and translate nav/footer strings"
```

---

## Task 13: Build verification and cleanup

- [ ] **Step 1: Run the dev server to verify**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && npm run dev
```

Open `http://localhost:3000` — verify:
- Page loads in French (default)
- Clicking the locale toggle in the navbar switches to English
- Nav links render in the correct language
- Home, Bio, Contact pages show translated text
- Work page still shows artists from DB
- Admin, Dashboard, Login routes still work

- [ ] **Step 2: Run build to catch TypeScript/compilation errors**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && npm run build
```

Expected: Successful build with no errors. If there are TypeScript errors, fix them before proceeding.

- [ ] **Step 3: Final commit**

```bash
cd /Users/thomasallen/Code/Thms25/shinji-no-sekai && git add -A && git commit -m "feat: complete next-intl JSON i18n migration (en/fr)"
```
