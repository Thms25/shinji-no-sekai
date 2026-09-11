'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useReducedMotion } from 'framer-motion'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react'

/* ── Scroll feel — tune these three ────────────────────────────────────────────
 *
 * WHEEL_LERP      How fast the page catches up to where your wheel asked it to go.
 *                 Lower = longer, floatier glide. Higher = tighter, closer to native.
 *                 1 would be no damping at all; Lenis's own default is 0.1.
 *                 Native-ish 0.14 · current 0.075 · very floaty 0.05
 *
 * WHEEL_MULTIPLIER  How much ground one wheel tick covers, relative to the browser.
 *                 This is the "is it slower?" knob — WHEEL_LERP only changes the
 *                 easing, not the distance travelled.
 *                 Native 1 · current 0.85 · noticeably slower 0.7
 *
 * ANCHOR_DURATION  Seconds for a navbar click to travel to its section, regardless
 *                 of distance. Snappy 1.0 · current 1.6 · stately 2.2
 *
 * Somewhere between "before" (WHEEL_LERP 1, WHEEL_MULTIPLIER 1) and now is roughly
 * WHEEL_LERP 0.1 with WHEEL_MULTIPLIER 0.95.
 */
const WHEEL_LERP = 0.075
const WHEEL_MULTIPLIER = 0.85
const ANCHOR_DURATION = 1.6

/**
 * Distance kept above a section when scrolling to it, so the anchored heading
 * clears the fixed navbar. Matches the `scroll-mt-24` on the page's sections.
 */
const ANCHOR_OFFSET = 96

/** A `#id`, an element, or an absolute scroll position in pixels (0 for the top). */
type ScrollTarget = string | HTMLElement | number

type SmoothScrollValue = {
  /** Scrolls to a target. Falls back to native scrolling when damping is off. */
  scrollTo: (target: ScrollTarget) => void
}

function nativeScrollTo(target: ScrollTarget, behavior: ScrollBehavior = 'smooth') {
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior })
    return
  }
  const el =
    typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  el?.scrollIntoView({ behavior, block: 'start' })
}

const SmoothScrollContext = createContext<SmoothScrollValue>({
  scrollTo: target => nativeScrollTo(target),
})

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}

/**
 * Damped page scrolling for the public single-page site.
 *
 * Lenis drives the real window scroll (rather than transforming a wrapper), so the
 * sticky hero and the fixed navbar keep behaving normally. It is deliberately scoped
 * to `/`: the admin console and artist portal are forms and tables, where anything
 * other than the browser's own scrolling gets in the way.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  const enabled = pathname === '/' && !reduceMotion

  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({
      lerp: WHEEL_LERP,
      wheelMultiplier: WHEEL_MULTIPLIER,
      // Leave touch alone — native momentum already feels right on a phone.
      syncTouch: false,
    })
    lenisRef.current = lenis

    let frame = 0
    const loop = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [enabled])

  const scrollTo = useCallback(
    (target: ScrollTarget) => {
      const lenis = lenisRef.current
      if (!lenis) {
        nativeScrollTo(target, reduceMotion ? 'auto' : 'smooth')
        return
      }
      // Slower than a wheel glide — an intentional jump across the page reads better
      // when it takes its time.
      lenis.scrollTo(target, {
        // A number is an absolute position; the navbar offset only makes sense
        // when aiming at an element that has a heading to keep clear.
        offset: typeof target === 'number' ? 0 : -ANCHOR_OFFSET,
        duration: ANCHOR_DURATION,
      })
    },
    [reduceMotion],
  )

  return (
    <SmoothScrollContext.Provider value={{ scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}
