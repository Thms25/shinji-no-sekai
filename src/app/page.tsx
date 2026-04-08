'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import type {
  HomePageContent,
  WorkPageContent,
  WorkArtist,
  ContactPageContent,
  BioPageContent,
} from '@/utils/db/content'

const FALLBACK_HOME_CONTENT: HomePageContent = {
  headline: 'SHINJI NO SEKAI',
  subheadline:
    'Audio Engineer & Sound Designer based in Brussels. Crafting immersive sonic experiences.',
  keyValues: [
    { title: 'Human connection', description: 'The prerequisite to everything else.' },
    { title: 'Vision first', description: 'Understand the story before touching the sound.' },
    { title: 'Full commitment', description: 'Every project is the only one that counts.' },
    { title: 'Earned trust', description: 'Built slowly, session by session.' },
  ],
}

const FALLBACK_WORK_CONTENT: WorkPageContent = {
  artists: [],
}

const FALLBACK_CONTACT: ContactPageContent = {
  heading: 'Get in Touch',
  subtext: 'Ready to start your next project? Send me a message.',
}

const FALLBACK_BIO: BioPageContent = {
  title: 'Shinji No Sekai',
  image: '/images/shinji_home_studio.jpg',
  paragraph1:
    'I am an audio engineer dedicated to finding the perfect sound. My journey began in the analog era and has evolved into the digital realm, blending classic techniques with modern innovation.',
  paragraph2:
    'Based in Tokyo, I work with artists from around the globe to bring their sonic visions to life. From mixing and mastering to full-scale production, I treat every project with the precision and passion it deserves.',
}


function getSpotifyArtistId(artist: WorkArtist): string | null {
  if (artist.spotify_id) return artist.spotify_id
  if (!artist.spotify_url) return null
  const m = artist.spotify_url.match(/spotify\.com\/artist\/([a-zA-Z0-9]+)/)
  return m ? m[1] : null
}

function ArtistCard({ artist }: { artist: WorkArtist }) {
  const spotifyLink =
    artist.spotify_url ||
    (artist.spotify_id
      ? `https://open.spotify.com/artist/${artist.spotify_id}`
      : null)
  const spotifyEmbedId = getSpotifyArtistId(artist)

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col gap-4"
    >
      <div className="flex gap-4">
        {artist.image && (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artist.image}
              alt={artist.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex-1">
          <h2 className="font-title text-lg font-semibold tracking-tight">
            {artist.name}
          </h2>
          {artist.roles && artist.roles.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {artist.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="font-caption rounded-full bg-tag/70 px-2.5 py-0.5 text-xs font-medium text-secondary"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {artist.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {artist.description}
        </p>
      )}

      {spotifyLink && (
        <div className="mt-auto pt-2 space-y-3">
          {spotifyEmbedId && (
            <div className="rounded-xl overflow-hidden bg-[#181818] border border-border">
              <iframe
                title={`${artist.name} on Spotify`}
                src={`https://open.spotify.com/embed/artist/${spotifyEmbedId}`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block"
              />
            </div>
          )}
          <Link
            href={spotifyLink}
            target="_blank"
            rel="noreferrer"
            className="font-caption inline-flex items-center text-xs font-medium text-primary hover:text-primary/80"
          >
            Listen on Spotify
          </Link>
        </div>
      )}
    </motion.article>
  )
}

export default function Home() {
  const [homeContent, setHomeContent] = useState<HomePageContent>(
    FALLBACK_HOME_CONTENT,
  )
  const [bioContent, setBioContent] = useState<BioPageContent>(FALLBACK_BIO)
  const [workContent, setWorkContent] = useState<WorkPageContent>(
    FALLBACK_WORK_CONTENT,
  )
  const [contactContent, setContactContent] =
    useState<ContactPageContent>(FALLBACK_CONTACT)

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const res = await fetch('/api/content?page=home', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load home content')
        const data = await res.json()
        if (data.content)
          setHomeContent({ ...FALLBACK_HOME_CONTENT, ...data.content })
      } catch (err) {
        console.error(err)
      }
    }

    const fetchWork = async () => {
      try {
        const res = await fetch('/api/content?page=work', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load work content')
        const data = await res.json()
        if (data.content)
          setWorkContent({ ...FALLBACK_WORK_CONTENT, ...data.content })
      } catch (err) {
        console.error(err)
      }
    }

    const fetchContact = async () => {
      try {
        const res = await fetch('/api/content?page=contact', {
          cache: 'no-store',
        })
        if (!res.ok) return
        const data = await res.json()
        if (data.content)
          setContactContent({ ...FALLBACK_CONTACT, ...data.content })
      } catch (err) {
        console.error(err)
      }
    }

    const fetchBio = async () => {
      try {
        const res = await fetch('/api/content?page=bio', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (data.content) setBioContent({ ...FALLBACK_BIO, ...data.content })
      } catch (err) {
        console.error(err)
      }
    }

    fetchHome()
    fetchBio()
    fetchWork()
    fetchContact()
  }, [])

  const hasArtists = workContent.artists.length > 0

  return (
    <div className="font-sans">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-8 sm:px-20 py-20">
        <div className="flex flex-col gap-12 items-center text-center max-w-3xl w-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="font-title text-5xl sm:text-7xl font-bold tracking-tighter"
          >
            {homeContent.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="font-caption text-xl text-muted-foreground"
          >
            {homeContent.subheadline}
          </motion.p>

          <div className="grid grid-cols-2 gap-x-12 gap-y-8 w-full max-w-lg">
            {homeContent.keyValues.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + idx * 0.1,
                  ease: 'easeOut',
                }}
                className="flex flex-col gap-1.5 text-center"
              >
                <span className="font-title text-sm font-semibold tracking-tight text-foreground/90">
                  {value.title}
                </span>
                <span className="font-caption text-xs text-muted-foreground/60 leading-relaxed">
                  {value.description}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="aspect-3/4 bg-card rounded-2xl overflow-hidden border border-border relative"
          >
            {bioContent.image.startsWith('http') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={bioContent.image}
                alt={bioContent.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={bioContent.image}
                alt={bioContent.title}
                fill
                className="object-cover"
              />
            )}
          </motion.div>

          <div className="space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-title text-4xl font-bold tracking-tight"
            >
              {bioContent.title}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4 text-muted-foreground leading-relaxed"
            >
              {bioContent.paragraph1 && <p>{bioContent.paragraph1}</p>}
              {bioContent.paragraph2 && <p>{bioContent.paragraph2}</p>}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Work */}
      <section
        id="work"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-title text-4xl font-bold mb-12 tracking-tight"
        >
          Selected Work
        </motion.h2>

        {!hasArtists && (
          <p className="text-muted-foreground">
            Projects coming soon. Check back as new work is added.
          </p>
        )}

        {hasArtists && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {workContent.artists.map((artist, idx) => (
              <ArtistCard key={idx} artist={artist} />
            ))}
          </motion.div>
        )}
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="font-title text-4xl font-bold tracking-tight">
              {contactContent.heading}
            </h2>
            <p className="font-caption text-muted-foreground">
              {contactContent.subtext}
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="font-caption text-sm font-medium"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="font-caption w-full bg-subtle border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="font-caption text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="font-caption w-full bg-subtle border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="message"
                className="font-caption text-sm font-medium"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="font-sans w-full bg-subtle border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              type="submit"
              className="font-caption w-full bg-foreground text-background font-medium py-3 rounded-lg hover:bg-secondary hover:text-background transition-colors flex items-center justify-center gap-2"
            >
              Send Message <Send size={18} />
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  )
}
