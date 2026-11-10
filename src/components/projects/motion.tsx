'use client'

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

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
