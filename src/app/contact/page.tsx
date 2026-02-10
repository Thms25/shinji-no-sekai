'use client'

import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ContactPageContent } from '@/utils/db/content'

const FALLBACK_CONTACT: ContactPageContent = {
  heading: 'Get in Touch',
  subtext: 'Ready to start your next project? Send me a message.',
}

export default function Contact() {
  const [content, setContent] = useState<ContactPageContent | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content?page=contact', {
          cache: 'no-store',
        })
        if (!res.ok) return
        const data = await res.json()
        if (data.content) {
          setContent({ ...FALLBACK_CONTACT, ...data.content })
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchContent()
  }, [])

  const { heading, subtext } = content ?? FALLBACK_CONTACT

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">{heading}</h1>
          <p className="text-muted-foreground">{subtext}</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-foreground text-background font-medium py-3 rounded-lg hover:bg-[#383838] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            Send Message <Send size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  )
}
