'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useSmoothScroll } from '@/components/SmoothScrollProvider'

export type LightboxImage = { src: string; alt: string }

type OpenLightbox = (image: LightboxImage, gallery?: LightboxImage[]) => void

const LightboxContext = createContext<OpenLightbox>(() => {})

/**
 * Opens an image full-screen. Pass the set it belongs to as `gallery` and the
 * overlay steps through it (arrows, keyboard, swipe). A no-op outside a
 * {@link LightboxProvider}.
 */
export function useLightbox() {
  return useContext(LightboxContext)
}

type State = { images: LightboxImage[]; index: number }

/** One shared overlay for every enlargeable image on the page. */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State | null>(null)
  const [direction, setDirection] = useState(0)
  const { setLocked } = useSmoothScroll()
  const touchX = useRef<number | null>(null)

  const close = useCallback(() => setState(null), [])

  const open = useCallback<OpenLightbox>((image, gallery) => {
    const images = gallery && gallery.length > 0 ? gallery : [image]
    const index = Math.max(
      0,
      images.findIndex(item => item.src === image.src),
    )
    setDirection(0)
    setState({ images, index })
  }, [])

  const step = useCallback((delta: number) => {
    setDirection(delta)
    setState(current =>
      current && current.images.length > 1
        ? {
            ...current,
            index: (current.index + delta + current.images.length) % current.images.length,
          }
        : current,
    )
  }, [])

  const isOpen = state !== null

  useEffect(() => {
    if (!isOpen) return
    setLocked(true)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setLocked(false)
    }
  }, [isOpen, close, step, setLocked])

  const image = state ? state.images[state.index] : null
  const many = (state?.images.length ?? 0) > 1

  const controlClasses =
    'flex h-11 w-11 items-center justify-center rounded-full bg-background/90 text-foreground transition-[opacity,transform] duration-150 hover:-translate-y-px active:scale-[.985]'

  return (
    <LightboxContext.Provider value={open}>
      {children}

      <AnimatePresence>
        {state && image && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={image.alt}
            onClick={close}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-foreground/85 p-4 pb-20 backdrop-blur-sm lg:p-16"
          >
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.img
                key={image.src}
                src={image.src}
                alt={image.alt}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 40, scale: d ? 1 : 0.94 }),
                  center: { opacity: 1, x: 0, scale: 1 },
                  exit: (d: number) => ({ opacity: 0, x: d * -40, scale: d ? 1 : 0.94 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="max-h-full max-w-full rounded-[24px] object-contain shadow-[0_30px_70px_rgba(0,0,0,.35)] lg:rounded-[32px]"
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className={`absolute top-4 right-4 lg:top-6 lg:right-6 ${controlClasses}`}
            >
              <X size={18} />
            </button>

            {many && (
              <div
                className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 lg:bottom-7"
                onClick={event => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className={controlClasses}
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="font-caption min-w-16 text-center text-[11px] tracking-[.2em] text-background tabular-nums">
                  {String(state.index + 1).padStart(2, '0')} / {String(state.images.length).padStart(2, '0')}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className={controlClasses}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  )
}
