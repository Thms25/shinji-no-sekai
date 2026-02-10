'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { BioPageContent } from '@/utils/db/content'

const FALLBACK_BIO: BioPageContent = {
  title: 'Shinji No Sekai',
  image: '/images/shinji_home_studio.jpg',
  paragraph1:
    'I am an audio engineer dedicated to finding the perfect sound. My journey began in the analog era and has evolved into the digital realm, blending classic techniques with modern innovation.',
  paragraph2:
    'Based in Tokyo, I work with artists from around the globe to bring their sonic visions to life. From mixing and mastering to full-scale production, I treat every project with the precision and passion it deserves.',
}

export default function Bio() {
  const [content, setContent] = useState<BioPageContent | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content?page=bio', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (data.content) {
          setContent({ ...FALLBACK_BIO, ...data.content })
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchContent()
  }, [])

  const bio = content ?? FALLBACK_BIO
  const isExternalImage = bio.image.startsWith('http://') || bio.image.startsWith('https://')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="aspect-3/4 bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative"
        >
          {isExternalImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={bio.image}
              alt={bio.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={bio.image}
              alt={bio.title}
              fill
              className="object-cover absolute inset-0"
            />
          )}
        </motion.div>

        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight"
          >
            {bio.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4 text-muted-foreground leading-relaxed"
          >
            {bio.paragraph1 && <p>{bio.paragraph1}</p>}
            {bio.paragraph2 && <p>{bio.paragraph2}</p>}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
