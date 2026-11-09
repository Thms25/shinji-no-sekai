'use client'

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'

/** The settle curve the whole site uses for entrances. */
export const EASE_ENTER = [0.22, 1, 0.36, 1] as const

/**
 * A title that rises once out of its own mask the first time it scrolls in. The
 * words are in the page, in place, from the first paint: only their offset inside
 * the mask animates, and reduced motion leaves them at rest.
 */
export function RiseText({
  children,
  as: Tag = 'span',
  className,
  delay = 0,
  onLoad = false,
}: {
  children: ReactNode
  as?: 'span' | 'h1' | 'h2' | 'h3'
  className?: string
  delay?: number
  /** Rise on mount (a hero headline) rather than when scrolled into view. */
  onLoad?: boolean
}) {
  const maskRef = useRef<HTMLSpanElement>(null)
  // Watch the mask, not the words: the words start below it, clipped, and an
  // observer never reports a clipped element as visible.
  const inView = useInView(maskRef, { once: true, margin: '0px 0px -8% 0px' })
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <Tag className={className}>{children}</Tag>

  return (
    <Tag className={className}>
      <span ref={maskRef} className="-my-[.14em] block overflow-hidden py-[.14em]">
        <motion.span
          className="block"
          initial={{ y: '105%' }}
          animate={onLoad || inView ? { y: '0%' } : undefined}
          transition={{ duration: 0.8, ease: EASE_ENTER, delay }}
        >
          {children}
        </motion.span>
      </span>
    </Tag>
  )
}

/**
 * A photograph that drifts a little slower than the page inside its fixed frame.
 * The frame never moves, only the picture behind it, so nothing on the page
 * shifts and text is never touched. Rests under reduced motion.
 */
export function ParallaxPhoto({
  src,
  alt,
  className = '',
  imgClassName = '',
  strength = 7,
  eager = false,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  /** Travel, in percent of the frame's height, either side of centre. */
  strength?: number
  eager?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        style={reduceMotion ? undefined : { y, scale: 1 + (strength * 2.4) / 100 }}
        className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  )
}

/**
 * Dealt moment "picture-develops", film look (design-taste-frontend): the
 * photograph comes up out of the paper once as it scrolls in, a pale grey print
 * first, its darks arriving before its colour, while it settles from a slight
 * zoom. About 1.6 s; a filter and a transform on the one picture. Without script,
 * under reduced motion or once done, it is simply the photograph.
 */
export function DevelopingPhoto({
  src,
  alt,
  className = '',
}: {
  src: string
  alt: string
  className?: string
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const frame = frameRef.current
    const img = imgRef.current
    if (!frame || !img || reduceMotion) return

    let animation: Animation | null = null
    let done = false
    // Armed: the picture waits as a faint print whose shapes already read.
    const PRINT = 'grayscale(1) contrast(.55) brightness(1.32)'
    img.style.filter = PRINT
    img.style.transform = 'scale(1.06)'
    const disarm = () => {
      img.style.filter = ''
      img.style.transform = ''
    }

    const run = async () => {
      if (done) return
      done = true
      if (!img.complete) {
        await new Promise(resolve => {
          img.addEventListener('load', resolve, { once: true })
          img.addEventListener('error', resolve, { once: true })
        })
      }
      animation = img.animate(
        [
          { filter: PRINT, transform: 'scale(1.06)' },
          { filter: 'grayscale(.8) contrast(.82) brightness(1.14)', offset: 0.3 },
          { filter: 'grayscale(.35) contrast(.95) brightness(1.04)', offset: 0.62 },
          { filter: 'grayscale(0) contrast(1) brightness(1)', transform: 'none' },
        ],
        { duration: 1600, easing: 'cubic-bezier(.3, .2, .3, 1)', fill: 'both' },
      )
      disarm()
      animation.finished.then(
        () => animation?.cancel(),
        () => {},
      )
    }

    const height = frame.getBoundingClientRect().height || 1
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          observer.disconnect()
          run()
        }
      },
      { threshold: Math.min(0.25, (0.4 * window.innerHeight) / height) },
    )
    observer.observe(frame)

    return () => {
      observer.disconnect()
      animation?.cancel()
      disarm()
    }
  }, [reduceMotion])

  return (
    <div
      ref={frameRef}
      data-moment="picture-develops"
      className={`relative isolate overflow-hidden ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="block h-full w-full object-cover"
      />
    </div>
  )
}
