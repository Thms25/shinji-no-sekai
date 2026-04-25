'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const BIO_IMAGE = '/images/shinji_home_studio.jpg'

export default function Bio() {
  const t = useTranslations('bio')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="aspect-3/4 bg-white/5 rounded-2xl overflow-hidden border border-white/10 relative"
        >
          <Image
            src={BIO_IMAGE}
            alt={t('title')}
            fill
            className="object-cover absolute inset-0"
          />
        </motion.div>

        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight"
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
