'use client'

import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, Instagram } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { LightboxProvider, useLightbox, type LightboxImage } from '@/components/home/Lightbox'
import type { HomePageContent, Localized, ProjectItem } from '@/utils/db/content'
import type { SiteLocale } from '@/utils/content/home-defaults'
import { DevelopingPhoto, EASE_ENTER, ParallaxPhoto, RiseText } from './motion'

type ProjectsViewProps = {
  content: HomePageContent
  locale: SiteLocale
}

/** Shared panel chrome, the same overlapping slabs as the home page. */
const PANEL_SHADOW =
  'shadow-[0_-16px_40px_rgba(59,47,34,.08)] lg:shadow-[0_-24px_56px_rgba(59,47,34,.1)]'

const pad = (v: number) => String(v).padStart(2, '0')

/* ── Photographs ──────────────────────────────────────────────────────────── */

function PhotoFrame({
  gallery,
  index,
  title,
  className,
  extra,
  develop = false,
}: {
  gallery: LightboxImage[]
  index: number
  title: string
  className: string
  extra?: number
  /** The page's one developing photograph (dealt moment "picture-develops"). */
  develop?: boolean
}) {
  const openLightbox = useLightbox()
  const t = useTranslations('projects')

  return (
    <button
      type="button"
      onClick={() => openLightbox(gallery[index], gallery)}
      aria-label={t('openPhoto', { title, index: index + 1, total: gallery.length })}
      className={`group relative block cursor-zoom-in overflow-hidden rounded-[24px] bg-border shadow-[0_14px_34px_rgba(59,47,34,.14)] lg:rounded-[30px] ${className}`}
    >
      <div className="absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03]">
        {develop ? (
          <DevelopingPhoto src={gallery[index].src} alt={gallery[index].alt} className="h-full w-full" />
        ) : (
          <ParallaxPhoto src={gallery[index].src} alt={gallery[index].alt} className="h-full w-full" />
        )}
      </div>
      {extra ? (
        <span className="font-caption absolute right-3 bottom-3 rounded-full bg-background/92 px-3.5 py-2 text-[10px] tracking-[.16em] text-foreground lg:right-4 lg:bottom-4 lg:text-[11px]">
          {t('morePhotos', { count: extra })}
        </span>
      ) : null}
    </button>
  )
}

/**
 * Several photographs: a pair, or one large frame beside two stacked (further
 * ones open from the last frame). Every other entry is mirrored.
 */
function EntryGallery({
  images,
  title,
  mirrored,
}: {
  images: string[]
  title: string
  mirrored: boolean
}) {
  const gallery: LightboxImage[] = images.map((src, i) => ({ src, alt: `${title} — ${i + 1}` }))
  const frame = (index: number, className: string, extra?: number) => (
    <PhotoFrame gallery={gallery} index={index} title={title} className={className} extra={extra} />
  )

  if (images.length === 2) {
    return (
      <div
        className={`grid gap-3 sm:items-stretch sm:gap-4 ${
          mirrored ? 'sm:grid-cols-[2fr_3fr]' : 'sm:grid-cols-[3fr_2fr]'
        }`}
      >
        <div className={mirrored ? 'sm:order-2' : ''}>
          {frame(0, 'aspect-[4/3] w-full sm:aspect-auto sm:h-full')}
        </div>
        <div className={mirrored ? 'sm:order-1' : ''}>{frame(1, 'aspect-[4/5] w-full')}</div>
      </div>
    )
  }

  const extra = images.length - 3
  return (
    <div
      className={`grid grid-cols-2 gap-3 sm:grid-rows-2 sm:gap-4 ${
        mirrored ? 'sm:grid-cols-[2fr_3fr]' : 'sm:grid-cols-[3fr_2fr]'
      }`}
    >
      <div
        className={`col-span-2 sm:col-span-1 sm:row-span-2 ${
          mirrored ? 'sm:col-start-2 sm:row-start-1' : ''
        }`}
      >
        {frame(0, 'aspect-[4/3] w-full sm:aspect-auto sm:h-full sm:min-h-[420px]')}
      </div>
      <div className={mirrored ? 'sm:col-start-1 sm:row-start-1' : ''}>
        {frame(1, 'aspect-square w-full sm:aspect-[4/3]')}
      </div>
      <div className={mirrored ? 'sm:col-start-1 sm:row-start-2' : ''}>
        {frame(2, 'aspect-square w-full sm:aspect-[4/3]', extra > 0 ? extra : undefined)}
      </div>
    </div>
  )
}

/* ── One entry ────────────────────────────────────────────────────────────── */

function Entry({
  project,
  number,
  index,
  locale,
  first,
}: {
  project: ProjectItem
  number: number
  index: number
  locale: SiteLocale
  first: boolean
}) {
  const ui = useTranslations('projects')
  const t = (value: Localized) => value[locale] || value.en
  const story = t(project.story)
  const mirrored = index % 2 === 1
  // One photo (usually a square release cover): the words beside it. Several:
  // the words above a gallery of their own.
  const compact = project.images.length <= 1

  const heading = (
    <div className="grid gap-3 lg:gap-4">
      <p className="font-caption flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] tracking-[.22em] text-secondary lg:text-[11px]">
        <span>N°{pad(number)}</span>
        {project.year && (
          <>
            <span aria-hidden className="h-px w-5 bg-border" />
            <span>{project.year}</span>
          </>
        )}
      </p>
      <RiseText
        as="h2"
        className={`font-title text-[38px] leading-[1.02] tracking-[-.025em] ${
          compact ? 'lg:text-[50px] lg:leading-none' : 'lg:text-[62px] lg:leading-[.98]'
        }`}
      >
        {project.title || '—'}
      </RiseText>
      <p className="text-sm font-light leading-[1.55] text-secondary lg:text-base">{t(project.meta)}</p>
    </div>
  )

  const storyBlock = story ? (
    <p className="max-w-[600px] text-[15px] font-light leading-[1.85] whitespace-pre-line text-prose lg:text-[17px] lg:leading-[1.9]">
      {story}
    </p>
  ) : null

  const listen = project.url ? (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group font-caption inline-flex min-h-11 items-center gap-2 self-start justify-self-start rounded-full bg-card px-5 text-[11px] uppercase tracking-[.16em] transition-transform duration-150 hover:-translate-y-px active:translate-y-px active:scale-[.985]"
    >
      {ui('listen')}
      <ArrowUpRight
        size={14}
        strokeWidth={1.6}
        className="transition-transform duration-150 group-hover:translate-x-[3px]"
      />
    </a>
  ) : null

  if (compact) {
    const hasCover = project.images.length > 0
    return (
      <div
        className={`grid items-center gap-6 sm:gap-10 ${
          hasCover
            ? mirrored
              ? 'sm:grid-cols-[minmax(0,1fr)_minmax(0,260px)]'
              : 'sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)]'
            : ''
        }`}
      >
        {hasCover && (
          <div className={mirrored ? 'sm:order-2' : ''}>
            <PhotoFrame
              gallery={[{ src: project.images[0], alt: project.title }]}
              index={0}
              title={project.title}
              className="aspect-square w-full max-w-[300px] sm:max-w-none"
              develop={first}
            />
          </div>
        )}
        <div className={`grid gap-5 lg:gap-6 ${mirrored ? 'sm:order-1' : ''}`}>
          {heading}
          {storyBlock}
          {listen}
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:gap-8">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
        {heading}
        {listen}
      </div>
      {storyBlock}
      <EntryGallery images={project.images} title={project.title} mirrored={mirrored} />
    </div>
  )
}

/* ── The page ─────────────────────────────────────────────────────────────── */

function ProjectsContent({ content, locale }: ProjectsViewProps) {
  const t = (value: Localized) => value[locale] || value.en
  const ui = useTranslations('projects')
  const reduceMotion = useReducedMotion()
  const { projectsPage, cta } = content
  // Exactly the order the back office shows: the home-page picks, then the rest.
  const projects = [
    ...content.projects.filter(project => project.featured),
    ...content.projects.filter(project => !project.featured),
  ]

  // The entry in the middle of the screen. The presentation column follows it,
  // so the page reads as one story told in the back office's order.
  const [active, setActive] = useState(0)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const listRef = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index))
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    itemRefs.current.forEach(item => item && observer.observe(item))
    return () => observer.disconnect()
  }, [projects.length])

  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 50%', 'end 50%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  const current = projects[active]

  // The presentation arrives once on load: the title rises, the rest follows.
  const after = (i: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.52, ease: EASE_ENTER, delay: 0.4 + i * 0.06 },
        }

  return (
    <div className="relative isolate">
      <section
        aria-labelledby="projects-title"
        className="relative z-[1] px-6 pt-10 pb-24 lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-20 lg:px-22 lg:pt-16 lg:pb-40"
      >
        {/* ── The presentation: stays beside the story on desktop ─────────── */}
        <div className="mb-14 lg:mb-0">
          <div className="lg:sticky lg:top-[124px]">
            <motion.p
              {...after(-6)}
              className="font-caption mb-5 text-[10px] uppercase tracking-[.28em] text-secondary lg:mb-7 lg:text-[11px] lg:tracking-[.3em]"
            >
              {t(projectsPage.kicker)}
            </motion.p>

            <RiseText
              as="h1"
              onLoad
              className="font-title text-[64px] leading-[.92] tracking-[-.035em] lg:text-[88px] lg:leading-[.9]"
            >
              <span id="projects-title">{t(projectsPage.title)}</span>
            </RiseText>

            <motion.p
              {...after(0)}
              className="mt-5 max-w-[420px] text-[15px] font-light leading-[1.8] text-prose lg:mt-7 lg:text-base"
            >
              {t(projectsPage.intro)}
            </motion.p>

            {projects.length > 0 && (
              <motion.div {...after(1)} className="mt-10 hidden lg:block" aria-hidden>
                <div className="flex items-baseline gap-3">
                  <span className="font-title text-[56px] leading-none tracking-[-.03em] text-primary tabular-nums">
                    {pad(active + 1)}
                  </span>
                  <span className="font-caption text-[11px] tracking-[.2em] text-secondary">
                    / {pad(projects.length)}
                  </span>
                </div>

                <div className="relative mt-5 h-px w-full bg-border">
                  <motion.div
                    className="absolute inset-y-0 left-0 w-full origin-left bg-foreground"
                    style={{ scaleX: reduceMotion ? scrollYProgress : progress }}
                  />
                </div>

                <div className="relative mt-5 h-14 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={current?.id ?? 'none'}
                      initial={reduceMotion ? false : { y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={reduceMotion ? undefined : { y: -24, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE_ENTER }}
                      className="absolute inset-x-0 top-0"
                    >
                      <p className="truncate font-title text-[22px] leading-tight">{current?.title}</p>
                      <p className="mt-1 truncate text-[13px] font-light text-secondary">
                        {current ? t(current.meta) : ''}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* ── The story, in the back office's order ───────────────────────── */}
        {projects.length === 0 ? (
          <p className="py-16 text-[15px] font-light text-prose">{ui('empty')}</p>
        ) : (
          <ol ref={listRef} aria-label={ui('journal')} className="grid">
            {projects.map((project, index) => (
              <li
                key={project.id}
                data-index={index}
                ref={el => {
                  itemRefs.current[index] = el
                }}
                className={index > 0 ? 'mt-14 border-t border-border pt-14 lg:mt-20 lg:pt-20' : ''}
              >
                <Entry
                  project={project}
                  number={index + 1}
                  index={index}
                  locale={locale}
                  first={index === 0}
                />
              </li>
            ))}
          </ol>
        )}
      </section>

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
              {t(cta.title)}
            </RiseText>
            <p className="mb-7 text-sm font-light leading-[1.7] text-on-accent lg:mb-0 lg:text-base">
              {t(cta.body)}
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

export default function ProjectsView(props: ProjectsViewProps) {
  return (
    <LightboxProvider>
      <ProjectsContent {...props} />
    </LightboxProvider>
  )
}
