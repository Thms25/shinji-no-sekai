'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const TAGS = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  figure: motion.figure,
  li: motion.li,
} as const

type RevealTag = keyof typeof TAGS

type RevealProps = {
  children: ReactNode
  /** Element to render. Defaults to a div. */
  as?: RevealTag
  className?: string
  /** Stagger, in seconds. The design offsets siblings by 70ms each. */
  delay?: number
  id?: string
}

/**
 * Scroll-in reveal used across the page: 30px rise with a long ease-out, fired once
 * when the element is 12% visible. Mirrors the IntersectionObserver in the source
 * design, but honours `prefers-reduced-motion` by rendering the element at rest.
 */
export function Reveal({ children, as = 'div', className, delay = 0, id }: RevealProps) {
  const Tag = TAGS[as]
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    const Plain = as
    return (
      <Plain className={className} id={id}>
        {children}
      </Plain>
    )
  }

  return (
    <Tag
      id={id}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </Tag>
  )
}

/** Matches the design's `index % 4 * 70ms` sibling stagger. */
export function staggerDelay(index: number): number {
  return ((index % 4) * 70) / 1000
}
