'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useSmoothScroll } from '@/components/SmoothScrollProvider'

type LightboxImage = { src: string; alt: string }

const LightboxContext = createContext<(image: LightboxImage) => void>(() => {})

/** Opens an image full-screen. A no-op outside a {@link LightboxProvider}. */
export function useLightbox() {
  return useContext(LightboxContext)
}

/** One shared overlay for every enlargeable image on the page. */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<LightboxImage | null>(null)
  const { setLocked } = useSmoothScroll()

  const close = useCallback(() => setImage(null), [])

  useEffect(() => {
    if (!image) return
    setLocked(true)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setLocked(false)
    }
  }, [image, close, setLocked])

  return (
    <LightboxContext.Provider value={setImage}>
      {children}

      <AnimatePresence>
        {image && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={image.alt}
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-foreground/85 p-4 backdrop-blur-sm lg:p-12"
          >
            <motion.img
              src={image.src}
              alt={image.alt}
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.94 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-full max-w-full rounded-[24px] object-contain shadow-[0_30px_70px_rgba(0,0,0,.35)] lg:rounded-[32px]"
            />
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground transition-opacity hover:opacity-70 lg:top-6 lg:right-6"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  )
}
