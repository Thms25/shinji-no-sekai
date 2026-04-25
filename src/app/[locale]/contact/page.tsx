'use client'

import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function Contact() {
  const t = useTranslations('contact')

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{t('heading')}</h1>
          <p className="text-muted-foreground">{t('subtext')}</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                {t('nameLabel')}
              </label>
              <input
                id="name"
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder={t('namePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('emailLabel')}
              </label>
              <input
                id="email"
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder={t('emailPlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              {t('messageLabel')}
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              placeholder={t('messagePlaceholder')}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-foreground text-background font-medium py-3 rounded-lg hover:bg-[#383838] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            {t('sendButton')} <Send size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  )
}
