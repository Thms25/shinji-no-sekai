'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  X,
  Upload as UploadIcon,
} from 'lucide-react'
import type {
  HomePageContent,
  WorkPageContent,
  WorkArtist,
} from '@/utils/db/content'

type TabId = 'home' | 'work'

const DEFAULT_HOME_CONTENT: HomePageContent = {
  headline: 'SHINJI NO SEKAI',
  subheadline:
    'Audio Engineer & Sound Designer based in Brussels. Crafting immersive sonic experiences.',
  ctaPrimaryLabel: 'View Work',
  ctaPrimaryHref: '/work',
  ctaSecondaryLabel: 'Contact Me',
  ctaSecondaryHref: '/contact',
}

const EMPTY_WORK_ARTIST: WorkArtist = {
  name: '',
  description: '',
  roles: [],
  image: '',
  spotify_id: '',
  spotify_url: '',
}

const DEFAULT_WORK_CONTENT: WorkPageContent = {
  artists: [],
}

export default function SiteContentAdmin() {
  const { user, loading, role } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [homeContent, setHomeContent] =
    useState<HomePageContent>(DEFAULT_HOME_CONTENT)
  const [workContent, setWorkContent] =
    useState<WorkPageContent>(DEFAULT_WORK_CONTENT)
  const [loadingContent, setLoadingContent] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [openArtistIndex, setOpenArtistIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (role !== 'admin') {
        router.push('/dashboard')
      } else {
        const fetchContent = async () => {
          try {
            const [homeRes, workRes] = await Promise.all([
              fetch('/api/content?page=home'),
              fetch('/api/content?page=work'),
            ])

            if (homeRes.ok) {
              const homeData = await homeRes.json()
              if (homeData.content) {
                setHomeContent({
                  ...DEFAULT_HOME_CONTENT,
                  ...homeData.content,
                })
              }
            }

            if (workRes.ok) {
              const workData = await workRes.json()
              if (workData.content) {
                setWorkContent({
                  ...DEFAULT_WORK_CONTENT,
                  ...workData.content,
                })
              }
            }
          } catch (err) {
            console.error('Error fetching site content:', err)
          } finally {
            setLoadingContent(false)
          }
        }

        fetchContent()
      }
    }
  }, [user, loading, role, router])

  const showMessage = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSaveHome = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          page: 'home',
          content: homeContent,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to save home content')
      }

      showMessage('Home page content saved')
    } catch (err) {
      console.error(err)
      showMessage('Error saving home content')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveWork = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          page: 'work',
          content: workContent,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to save work content')
      }

      showMessage('Work page content saved')
    } catch (err) {
      console.error(err)
      showMessage('Error saving work content')
    } finally {
      setSaving(false)
    }
  }

  const handleAddArtist = () => {
    setWorkContent(prev => ({
      ...prev,
      artists: [...prev.artists, { ...EMPTY_WORK_ARTIST }],
    }))
  }

  const handleUpdateArtist = (index: number, updated: Partial<WorkArtist>) => {
    setWorkContent(prev => {
      const next = [...prev.artists]
      next[index] = {
        ...next[index],
        ...updated,
        // Ensure roles is always an array
        roles:
          updated.roles ??
          next[index].roles ??
          (updated as { roles?: string[] }).roles ??
          [],
      }
      return { ...prev, artists: next }
    })
  }

  const handleRemoveArtist = (index: number) => {
    setWorkContent(prev => ({
      ...prev,
      artists: prev.artists.filter((_, i) => i !== index),
    }))
  }

  const handleAddRole = (artistIndex: number, role: string) => {
    const trimmed = role.trim()
    if (!trimmed) return
    setWorkContent(prev => {
      const next = [...prev.artists]
      const current = next[artistIndex].roles ?? []
      if (current.includes(trimmed)) return prev
      next[artistIndex] = {
        ...next[artistIndex],
        roles: [...current, trimmed],
      }
      return { ...prev, artists: next }
    })
  }

  const handleRemoveRole = (artistIndex: number, roleIndex: number) => {
    setWorkContent(prev => {
      const next = [...prev.artists]
      const roles = [...(next[artistIndex].roles ?? [])]
      roles.splice(roleIndex, 1)
      next[artistIndex] = { ...next[artistIndex], roles }
      return { ...prev, artists: next }
    })
  }

  const handleMoveArtist = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= workContent.artists.length) return
    setWorkContent(prev => {
      const next = [...prev.artists]
      ;[next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]]
      return { ...prev, artists: next }
    })
    setOpenArtistIndex(prev =>
      prev === fromIndex ? toIndex : prev === toIndex ? fromIndex : prev,
    )
  }

  const handleImageUpload = async (artistIndex: number, file: File) => {
    const formData = new FormData()
    formData.set('file', file)
    try {
      const res = await fetch('/api/images/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Upload failed')
      }
      const data = await res.json()
      const url =
        data.url ?? (data.fileId ? `/api/images/${data.fileId}` : null)
      if (url) {
        handleUpdateArtist(artistIndex, { image: url })
      }
    } catch (err) {
      console.error(err)
      showMessage(err instanceof Error ? err.message : 'Image upload failed')
    }
  }

  if (loading || !user || role !== 'admin') {
    return null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/admin"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Site Content Editor
        </h1>
        <p className="text-muted-foreground mt-1">
          Edit the public-facing content for the home and work pages.
        </p>
      </div>

      <div className="mb-6 flex gap-2 border-b border-white/10 pb-1">
        {(['home', 'work'] as TabId[]).map(tab => (
          <span
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'home' ? 'Home Page' : 'Work Page'}
            {activeTab === tab && (
              <motion.div
                layoutId="site-content-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                initial={false}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </span>
        ))}
      </div>

      {loadingContent ? (
        <div className="text-muted-foreground text-sm">Loading content…</div>
      ) : (
        <>
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Headline</label>
                <input
                  type="text"
                  value={homeContent.headline}
                  onChange={e =>
                    setHomeContent(prev => ({
                      ...prev,
                      headline: e.target.value,
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subheadline</label>
                <textarea
                  rows={3}
                  value={homeContent.subheadline}
                  onChange={e =>
                    setHomeContent(prev => ({
                      ...prev,
                      subheadline: e.target.value,
                    }))
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={homeContent.ctaPrimaryLabel}
                    onChange={e =>
                      setHomeContent(prev => ({
                        ...prev,
                        ctaPrimaryLabel: e.target.value,
                      }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Primary CTA Link
                  </label>
                  <input
                    type="text"
                    value={homeContent.ctaPrimaryHref}
                    onChange={e =>
                      setHomeContent(prev => ({
                        ...prev,
                        ctaPrimaryHref: e.target.value,
                      }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    value={homeContent.ctaSecondaryLabel}
                    onChange={e =>
                      setHomeContent(prev => ({
                        ...prev,
                        ctaSecondaryLabel: e.target.value,
                      }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Secondary CTA Link
                  </label>
                  <input
                    type="text"
                    value={homeContent.ctaSecondaryHref}
                    onChange={e =>
                      setHomeContent(prev => ({
                        ...prev,
                        ctaSecondaryHref: e.target.value,
                      }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveHome}
                  disabled={saving}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save Home Content'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'work' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Artists</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage the artists displayed on the work page.
                  </p>
                </div>
                <button
                  onClick={handleAddArtist}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus size={16} /> Add Artist
                </button>
              </div>

              {workContent.artists.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No artists added yet. Click &quot;Add Artist&quot; to get
                  started.
                </p>
              )}

              <div className="space-y-2">
                {workContent.artists.map((artist, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenArtistIndex(prev =>
                          prev === index ? null : index,
                        )
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                    >
                      <div
                        className="flex items-center gap-0.5 shrink-0"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleMoveArtist(index, 'up')}
                          disabled={index === 0}
                          className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                          aria-label="Move up"
                        >
                          <ChevronUp size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveArtist(index, 'down')}
                          disabled={index === workContent.artists.length - 1}
                          className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                          aria-label="Move down"
                        >
                          <ChevronDown size={18} />
                        </button>
                      </div>
                      <span className="flex-1 font-semibold">
                        {artist.name || `Artist ${index + 1}`}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {openArtistIndex === index ? 'Collapse' : 'Edit'}
                      </span>
                      <motion.span
                        animate={{
                          rotate: openArtistIndex === index ? 180 : 0,
                        }}
                        className="shrink-0 text-muted-foreground"
                      >
                        <ChevronDown size={18} />
                      </motion.span>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          handleRemoveArtist(index)
                          if (openArtistIndex === index)
                            setOpenArtistIndex(null)
                          else if (
                            openArtistIndex !== null &&
                            openArtistIndex > index
                          ) {
                            setOpenArtistIndex(openArtistIndex - 1)
                          }
                        }}
                        className="shrink-0 p-1.5 rounded text-muted-foreground hover:text-red-400 hover:bg-white/10 transition-colors"
                        aria-label="Remove artist"
                      >
                        <Trash2 size={18} />
                      </button>
                    </button>

                    <AnimatePresence initial={false}>
                      {openArtistIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            height: { duration: 0.2 },
                            opacity: { duration: 0.15 },
                          }}
                          className="border-t border-white/10"
                        >
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  value={artist.name}
                                  onChange={e =>
                                    handleUpdateArtist(index, {
                                      name: e.target.value,
                                    })
                                  }
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Roles
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {(artist.roles ?? []).map((role, roleIdx) => (
                                    <span
                                      key={roleIdx}
                                      className="inline-flex items-center gap-1 rounded-full bg-white/10 pl-2.5 pr-1 py-0.5 text-xs font-medium"
                                    >
                                      {role}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveRole(index, roleIdx)
                                        }
                                        className="rounded-full p-0.5 hover:bg-white/20 transition-colors"
                                        aria-label={`Remove ${role}`}
                                      >
                                        <X size={12} />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                                <div className="flex gap-2 mt-1">
                                  <input
                                    type="text"
                                    placeholder="Add a role…"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    onKeyDown={e => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddRole(
                                          index,
                                          e.currentTarget.value,
                                        )
                                        e.currentTarget.value = ''
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={e => {
                                      const input = e.currentTarget
                                        .previousElementSibling as HTMLInputElement
                                      if (input) {
                                        handleAddRole(index, input.value)
                                        input.value = ''
                                      }
                                    }}
                                    className="shrink-0 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Description
                              </label>
                              <textarea
                                rows={3}
                                value={artist.description}
                                onChange={e =>
                                  handleUpdateArtist(index, {
                                    description: e.target.value,
                                  })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Image
                                </label>
                                <div className="flex items-center gap-3">
                                  {artist.image && (
                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/10">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={artist.image}
                                        alt={artist.name || 'Artist'}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors">
                                    <UploadIcon size={16} />
                                    {artist.image ? 'Change' : 'Upload'}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="sr-only"
                                      onChange={e => {
                                        const file = e.target.files?.[0]
                                        if (file) handleImageUpload(index, file)
                                        e.target.value = ''
                                      }}
                                    />
                                  </label>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Spotify URL
                                </label>
                                <input
                                  type="text"
                                  value={artist.spotify_url ?? ''}
                                  onChange={e =>
                                    handleUpdateArtist(index, {
                                      spotify_url: e.target.value,
                                    })
                                  }
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Spotify ID (optional)
                                </label>
                                <input
                                  type="text"
                                  value={artist.spotify_id ?? ''}
                                  onChange={e =>
                                    handleUpdateArtist(index, {
                                      spotify_id: e.target.value,
                                    })
                                  }
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveWork}
                  disabled={saving}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save Work Content'}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {message && (
        <div className="fixed bottom-6 right-6 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm">
          {message}
        </div>
      )}
    </div>
  )
}
