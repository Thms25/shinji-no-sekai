'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Images, Instagram, LayoutGrid, List } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useState, type CSSProperties } from 'react'
import type { HomePageContent, Localized, ProjectItem } from '@/utils/db/content'
import { creditLines, creditText, type SiteLocale } from '@/utils/content/home-defaults'
import { Credits } from '@/components/Credits'
import { EASE_ENTER, RiseText } from './motion'
import { ProjectSheet } from './ProjectSheet'

type ProjectsViewProps = {
  content: HomePageContent
  locale: SiteLocale
}

type View = 'wall' | 'index'

/** Shared panel chrome, the same overlapping slabs as the home page. */
const PANEL_SHADOW =
  'shadow-[0_-16px_40px_rgba(59,47,34,.08)] lg:shadow-[0_-24px_56px_rgba(59,47,34,.1)]'

/** Covers that develop on load: about the first screen at any width. */
const DEVELOPED = 32

/** Marks a cover ready to develop, whether it loads now or was already cached. */
function markReady(img: HTMLImageElement | null) {
  if (img?.complete && img.naturalWidth > 0) img.dataset.ready = ''
}

/* ── The wall ─────────────────────────────────────────────────────────────── */

function WallTile({
  project,
  index,
  locale,
  onOpen,
  onPoint,
}: {
  project: ProjectItem
  index: number
  locale: SiteLocale
  onOpen: (index: number) => void
  onPoint: (index: number) => void
}) {
  const t = useTranslations('projects')
  const cover = project.images[0]
  const develop = index < DEVELOPED
  // The credit line stays in the page as text (for screen readers and search),
  // though the wall itself shows only the cover.
  const credit = [creditLines(project.credits, locale).map(creditText).join('; '), project.year].filter(Boolean).join(', ')
  const creditId = `credit-${project.id}`

  return (
    <li>
      {credit && (
        <span id={creditId} className="sr-only">
          {credit}
        </span>
      )}
      <button
        type="button"
        aria-describedby={credit ? creditId : undefined}
        onClick={() => onOpen(index)}
        onMouseEnter={() => onPoint(index)}
        onFocus={() => onPoint(index)}
        aria-label={t('open', { title: project.title || '—' })}
        className="wall-tile group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-[8px] bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground lg:rounded-[12px]"
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={develop ? markReady : undefined}
            src={cover}
            alt={project.title}
            loading={develop ? 'eager' : 'lazy'}
            decoding="async"
            data-develop={develop ? '' : undefined}
            onLoad={develop ? event => (event.currentTarget.dataset.ready = '') : undefined}
            style={{ '--develop-delay': `${120 + index * 38}ms` } as CSSProperties}
            className="wall-photo h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03]"
          />
        ) : (
          <span className="font-title flex h-full items-center justify-center p-3 text-center text-[18px] leading-[1.05] text-secondary lg:text-[22px]">
            {project.title}
          </span>
        )}
        {project.images.length > 1 && (
          <span
            aria-hidden
            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-foreground lg:top-2 lg:right-2 lg:h-7 lg:w-7"
          >
            <Images size={13} strokeWidth={1.7} />
          </span>
        )}
      </button>
    </li>
  )
}

/**
 * The cover under the pointer, named at the foot of the screen (desktop): the
 * wall stays all pictures, the words come to you.
 */
function Readout({
  project,
  locale,
}: {
  project: ProjectItem | null
  locale: SiteLocale
}) {
  const t = useTranslations('projects')
  const reduceMotion = useReducedMotion()
  const credits = project ? creditLines(project.credits, locale) : []

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-6 z-40 hidden justify-center px-6 lg:flex">
      <AnimatePresence>
        {project && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: EASE_ENTER }}
            className="flex max-w-[760px] items-center overflow-hidden rounded-full bg-foreground px-7 py-4 text-background shadow-[0_18px_40px_rgba(30,22,14,.28)]"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={project.id}
                initial={reduceMotion ? false : { y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduceMotion ? undefined : { y: -18, opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE_ENTER }}
                className="flex min-w-0 items-baseline gap-3"
              >
                <span className="font-title truncate text-[22px] leading-none">{project.title}</span>
                <Credits
                  inline
                  lines={credits}
                  className="truncate text-[13px] font-light text-background/65"
                />
                {project.images.length > 1 && (
                  <span className="font-caption shrink-0 text-[10px] tracking-[.16em] text-background/65">
                    {t('photos', { count: project.images.length })}
                  </span>
                )}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── The index ────────────────────────────────────────────────────────────── */

function IndexRow({
  project,
  index,
  locale,
  onOpen,
}: {
  project: ProjectItem
  index: number
  locale: SiteLocale
  onOpen: (index: number) => void
}) {
  const t = useTranslations('projects')
  const credits = creditLines(project.credits, locale)
  const cover = project.images[0]

  return (
    <li className="border-b border-border">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={t('open', { title: project.title || '—' })}
        className="group grid w-full grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-4 py-3 text-left transition-colors duration-200 hover:bg-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground lg:grid-cols-[56px_minmax(0,1.1fr)_minmax(0,1fr)_72px_20px] lg:gap-6 lg:rounded-[14px] lg:px-3"
      >
        <span className="block aspect-square overflow-hidden rounded-[6px] bg-card">
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
        </span>
        <span className="min-w-0">
          <span className="font-title block truncate text-[21px] leading-tight lg:text-[26px]">
            {project.title || '—'}
          </span>
          {credits.length > 0 && (
            <Credits
              inline
              lines={credits}
              className="mt-0.5 block truncate text-[13px] font-light text-secondary lg:hidden"
            />
          )}
        </span>
        <Credits inline lines={credits} className="hidden truncate text-sm font-light text-secondary lg:block" />
        <span className="font-caption text-[10px] tracking-[.18em] text-secondary tabular-nums lg:text-[11px]">
          {project.year}
        </span>
        <ArrowUpRight
          size={16}
          strokeWidth={1.5}
          className="hidden text-secondary transition-transform duration-150 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] lg:block"
        />
      </button>
    </li>
  )
}

/* ── The page ─────────────────────────────────────────────────────────────── */

export default function ProjectsView({ content, locale }: ProjectsViewProps) {
  const pick = (value: Localized) => value[locale] || value.en
  const t = useTranslations('projects')
  const reduceMotion = useReducedMotion()
  const { projectsPage, cta } = content
  // Exactly the order the back office shows: the home-page picks, then the rest.
  const projects = [
    ...content.projects.filter(project => project.featured),
    ...content.projects.filter(project => !project.featured),
  ]

  const [view, setView] = useState<View>('wall')
  const [pointed, setPointed] = useState<number | null>(null)
  const [opened, setOpened] = useState<number | null>(null)
  const total = projects.length

  const close = useCallback(() => setOpened(null), [])
  const step = useCallback(
    (delta: number) => setOpened(i => (i === null ? i : (i + delta + total) % total)),
    [total],
  )

  const views: { id: View; label: string; Icon: typeof LayoutGrid }[] = [
    { id: 'wall', label: t('wall'), Icon: LayoutGrid },
    { id: 'index', label: t('index'), Icon: List },
  ]

  return (
    <div className="relative isolate">
      <section
        aria-labelledby="projects-title"
        className="relative z-[1] px-4 pt-8 pb-24 sm:px-6 lg:px-12 lg:pt-12 lg:pb-36 xl:px-22"
      >
        {/* ── Title bar: the name and the view ────────────────────────────── */}
        <div className="mb-6 flex items-end justify-between gap-4 lg:mb-9">
          <RiseText
            as="h1"
            onLoad
            className="font-title text-[46px] leading-[.95] tracking-[-.035em] lg:text-[76px] lg:leading-[.9]"
          >
            <span id="projects-title">{pick(projectsPage.title)}</span>
          </RiseText>

          {total > 0 && (
            <div
              role="group"
              aria-label={t('view')}
              className="flex shrink-0 rounded-full bg-card p-1"
            >
              {views.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={view === id}
                  onClick={() => setView(id)}
                  className={`font-caption relative flex min-h-11 items-center gap-2 rounded-full px-3.5 text-[10px] uppercase tracking-[.16em] transition-colors duration-200 lg:px-4.5 lg:text-[11px] ${
                    view === id ? 'text-background' : 'text-secondary hover:text-foreground'
                  }`}
                >
                  {view === id && (
                    <motion.span
                      layoutId="projects-view"
                      transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_ENTER }}
                      className="absolute inset-0 rounded-full bg-foreground"
                    />
                  )}
                  <Icon size={14} strokeWidth={1.7} className="relative" />
                  <span className="relative hidden sm:inline">{label}</span>
                  <span className="sr-only sm:hidden">{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── The projects, in the back office's order ────────────────────── */}
        {total === 0 ? (
          <p className="py-16 text-[15px] font-light text-prose">{t('empty')}</p>
        ) : view === 'wall' ? (
          <ul
            aria-label={pick(projectsPage.title)}
            onMouseLeave={() => setPointed(null)}
            className="wall grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 md:grid-cols-5 lg:grid-cols-7 lg:gap-2.5 xl:grid-cols-8 2xl:grid-cols-10"
          >
            {projects.map((project, index) => (
              <WallTile
                key={project.id}
                project={project}
                index={index}
                locale={locale}
                onOpen={setOpened}
                onPoint={setPointed}
              />
            ))}
          </ul>
        ) : (
          <ol aria-label={pick(projectsPage.title)} className="border-t border-border">
            {projects.map((project, index) => (
              <IndexRow key={project.id} project={project} index={index} locale={locale} onOpen={setOpened} />
            ))}
          </ol>
        )}
      </section>

      {view === 'wall' && opened === null && (
        <Readout
          project={pointed !== null ? (projects[pointed] ?? null) : null}
          locale={locale}
        />
      )}

      <ProjectSheet projects={projects} index={opened} locale={locale} onClose={close} onStep={step} />

      {/* ── Contact ──────────────────────────────────────────────────────────── */}
      <section
        id="contact"
        className={`relative z-[4] -mt-5.5 mx-1 mb-2 rounded-[38px] bg-primary px-6.5 pt-13 pb-11 lg:-mt-12 lg:mx-5 lg:mb-4 lg:rounded-[64px] lg:px-22 lg:pt-28 lg:pb-23 ${PANEL_SHADOW}`}
      >
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-15">
          <div>
            <RiseText
              as="h2"
              className="font-title mb-3 text-[40px] leading-[.98] tracking-[-.03em] lg:mb-4.5 lg:text-[76px] lg:leading-[.95] lg:tracking-[-.035em]"
            >
              {pick(cta.title)}
            </RiseText>
            <p className="mb-7 text-sm font-light leading-[1.7] text-on-accent lg:mb-0 lg:text-base">
              {pick(cta.body)}
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 lg:items-end">
            <a
              href={`mailto:${cta.email}`}
              className="font-caption block rounded-full bg-foreground px-5.5 py-4.5 text-center text-xs tracking-[.1em] text-background transition-[opacity,transform] duration-150 hover:-translate-y-px hover:opacity-90 active:translate-y-px active:scale-[.985] lg:whitespace-nowrap lg:px-9.5 lg:py-5.5 lg:text-[13px] lg:tracking-[.08em]"
            >
              {cta.email} →
            </a>
            {cta.instagram && (
              <a
                href={cta.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-caption inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-foreground/25 px-5.5 py-3.5 text-[11px] uppercase tracking-[.16em] text-foreground transition-opacity hover:opacity-60 lg:px-7"
              >
                <Instagram size={14} strokeWidth={1.6} />
                Instagram
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
