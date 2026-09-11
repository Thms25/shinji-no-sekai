'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Soft accent glow that eases toward the pointer. It sits behind everything on a
 * fixed layer, so it reads over the open hero and is covered by the solid panels
 * as they scroll up — the same effect the source design gets inside its frame.
 */
export function AccentBlob() {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(hover: none)').matches) return

    let targetX = window.innerWidth * 0.5
    let targetY = window.innerHeight * 0.35
    let x = targetX
    let y = targetY
    let frame = 0
    let alive = true

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
    }

    const tick = () => {
      if (!alive) return
      x += (targetX - x) * 0.055
      y += (targetY - y) * 0.055
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointerMove)
    tick()

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [reduceMotion])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        ref={ref}
        className="absolute left-0 top-0 -ml-[170px] -mt-[170px] h-[340px] w-[340px] rounded-full lg:-ml-[310px] lg:-mt-[310px] lg:h-[620px] lg:w-[620px]"
        style={{
          background:
            'radial-gradient(circle, rgba(196,149,106,.32), rgba(196,149,106,0) 68%)',
          transform: 'translate3d(50vw, 35vh, 0)',
        }}
      />
    </div>
  )
}
