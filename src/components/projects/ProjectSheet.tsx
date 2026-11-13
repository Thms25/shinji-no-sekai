'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { useSmoothScroll } from '@/components/SmoothScrollProvider'
import type { Localized, ProjectItem } from '@/utils/db/content'
import { creditLines, type SiteLocale } from '@/utils/content/home-defaults'
import { Credits } from '@/components/Credits'
import { EASE_ENTER } from './motion'

const pad = (value: number) => String(value).padStart(2, '0')

const CONTROL =
  'flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-transform duration-150 hover:-translate-y-px active:translate-y-px active:scale-[.985]'

/* ── Photographs ──────────────────────────────────────────────────────────── */

/** The project's photographs: one at a time, thumbnails and swipe for the rest. */
function SheetPhotos({ images, title }: { images: string[]; title: string }) {
  const t = useTranslations('projects')
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)
  const many = images.length > 1
  const step = (delta: number) => setIndex(i => (i + delta + images.length) % images.length)

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-card p-10 lg:aspect-auto lg:h-full">
        <span className="font-title text-center text-[44px] leading-none tracking-[-.03em] text-secondary">
          {title}
        </span>
      </div>
    )
  }

  return (
    <div
      className="relative flex aspect-square flex-col bg-card lg:aspect-auto lg:h-full"
      onTouchStart={event => {
        touchX.current = event.touches[0]?.clientX ?? null
      }}
      onTouchEnd={event => {
        const start = touchX.current
        const end = event.changedTouches[0]?.clientX
        touchX.current = null
        if (start === null || end === undefined || !many) return
        if (Math.abs(end - start) > 48) step(end < start ? 1 : -1)
      }}
    >
      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={images[index]}
            src={images[index]}
            alt={t('photoOf', { title, index: index + 1, total: images.length })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 h-full w-full object-contain p-5 lg:p-10"
          />
        </AnimatePresence>
      </div>

      {many && (
        <div className="flex items-center gap-2 overflow-x-auto px-5 pb-5 lg:px-10 lg:pb-8">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t('photoOf', { title, index: i + 1, total: images.length })}
              aria-current={i === index}
              className={`h-12 w-12 shrink-0 overflow-hidden rounded-[8px] transition-[opacity,transform] duration-150 hover:-translate-y-px ${
                i === index ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card' : 'opacity-55 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
          <span className="font-caption ml-auto shrink-0 pl-3 text-[10px] tracking-[.2em] text-secondary tabular-nums">
            {pad(index + 1)} / {pad(images.length)}
          </span>
        </div>
      )}
    </div>
  )
}

/* ── The sheet ────────────────────────────────────────────────────────────── */

/**
 * One project, opened from the wall: its photographs beside its words, with the
 * neighbours a step away (buttons, or ← → on the keyboard). Esc or the backdrop
 * closes it and focus goes back to the cover it came from.
 */
export function ProjectSheet({
  projects,
  index,
  locale,
  onClose,
  onStep,
}: {
  projects: ProjectItem[]
  index: number | null
  locale: SiteLocale
  onClose: () => void
  onStep: (delta: number) => void
}) {
  const t = useTranslations('projects')
  const pick = (value: Localized) => value[locale] || value.en
  const reduceMotion = useReducedMotion()
  const { setLocked } = useSmoothScroll()
  const closeRef = useRef<HTMLButtonElement>(null)
  const isOpen = index !== null
  const project = index !== null ? projects[index] : null

  useEffect(() => {
    if (!isOpen) return
    const returnTo = document.activeElement as HTMLElement | null
    setLocked(true)
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onStep(1)
      if (event.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setLocked(false)
      returnTo?.focus({ preventScroll: true })
    }
  }, [isOpen, onClose, onStep, setLocked])

  const story = project ? pick(project.story) : ''
  const credits = project ? creditLines(project.credits, locale) : []

  return (
    <AnimatePresence>
      {project && index !== null && (
        <motion.div
          key="sheet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-foreground/55 backdrop-blur-[6px] lg:items-center lg:p-10"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-sheet-title"
            onClick={event => event.stopPropagation()}
            initial={reduceMotion ? false : { y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { y: 32, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_ENTER }}
            data-lenis-prevent
            className="relative h-[94dvh] w-full overflow-y-auto overscroll-contain rounded-t-[28px] bg-background shadow-[0_30px_80px_rgba(30,22,14,.35)] lg:grid lg:h-[min(86vh,800px)] lg:max-w-[1240px] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:overflow-hidden lg:rounded-[36px]"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t('close')}
              className={`absolute top-4 right-4 z-10 bg-background/92 shadow-[0_6px_18px_rgba(59,47,34,.12)] lg:top-6 lg:right-6 ${CONTROL}`}
            >
              <X size={18} strokeWidth={1.6} />
            </button>

            <SheetPhotos key={project.id} images={project.images} title={project.title} />

            <div className="flex flex-col px-6 pt-7 pb-6 lg:min-h-0 lg:overflow-y-auto lg:px-11 lg:pt-14 lg:pb-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={project.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE_ENTER }}
                  className="grid gap-5 lg:gap-6"
                >
                  {project.year && (
                    <p className="font-caption text-[10px] tracking-[.22em] text-secondary lg:text-[11px]">
                      {project.year}
                    </p>
                  )}
                  <div className="grid gap-3">
                    <h2
                      id="project-sheet-title"
                      className="font-title pr-12 text-[40px] leading-[1.02] tracking-[-.025em] lg:pr-10 lg:text-[54px] lg:leading-[.98]"
                    >
                      {project.title || '—'}
                    </h2>
                    <Credits
                      lines={credits}
                      className="grid gap-1.5 text-sm font-light leading-[1.55] text-secondary lg:text-[15px]"
                    />
                  </div>
                  {story && (
                    <p className="text-[15px] font-light leading-[1.85] whitespace-pre-line text-prose lg:text-base">
                      {story}
                    </p>
                  )}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group font-caption inline-flex min-h-11 items-center gap-2 justify-self-start rounded-full bg-foreground px-5 text-[11px] uppercase tracking-[.16em] text-background transition-transform duration-150 hover:-translate-y-px active:translate-y-px active:scale-[.985]"
                    >
                      {t('listen')}
                      <ArrowUpRight
                        size={14}
                        strokeWidth={1.6}
                        className="transition-transform duration-150 group-hover:translate-x-[3px]"
                      />
                    </a>
                  )}
                </motion.div>
              </AnimatePresence>

              {projects.length > 1 && (
                <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-5 lg:mt-auto">
                  <button
                    type="button"
                    onClick={() => onStep(-1)}
                    aria-label={t('previous')}
                    className={`${CONTROL} bg-card`}
                  >
                    <ArrowLeft size={17} strokeWidth={1.6} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onStep(1)}
                    aria-label={t('next')}
                    className={`${CONTROL} bg-card`}
                  >
                    <ArrowRight size={17} strokeWidth={1.6} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
