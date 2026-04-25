'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

export default function Bio() {
  const t = useTranslations('bio')
  const [image, setImage] = useState('/images/shinji_home_studio.jpg')

  useEffect(() => {
    fetch('/api/content?page=bio', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.content?.image) setImage(data.content.image) })
      .catch(console.error)
  }, [])

  const isExternalImage = image.startsWith('http')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="aspect-3/4 bg-card rounded-2xl overflow-hidden border border-border relative"
        >
          {isExternalImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={t('title')}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image src={image} alt={t('title')} fill className="object-cover absolute inset-0" />
          )}
        </motion.div>

        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-title text-4xl font-bold tracking-tight"
          >
            {t('title')}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4 text-muted-foreground leading-relaxed"
          >
            <p>{t('paragraph1')}</p>
            <p>{t('paragraph2')}</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
