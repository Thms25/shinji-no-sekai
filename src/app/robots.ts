import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

/**
 * Everyone may read the site, AI search crawlers included (named so the intent is
 * explicit). The API stays out, except the images the pages show. /admin and
 * /login are not blocked here on purpose: a crawler has to fetch them to read
 * their `noindex`.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
]

export default function robots(): MetadataRoute.Robots {
  const access = { allow: ['/', '/api/images/'], disallow: ['/api/'] }
  return {
    rules: [{ userAgent: '*', ...access }, { userAgent: AI_CRAWLERS, ...access }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
