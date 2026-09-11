'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, LogOut } from 'lucide-react'
import type { HomePageContent, LegacyContent } from '@/utils/db/content'
import {
  type TabId,
  DEFAULT_HOME_CONTENT,
  migrateLegacyHome,
  normalizeHomeContent,
  type SiteLocale,
} from './content-defaults'
import { SiteContentTabs } from './SiteContentTabs'
import { LocaleToggle } from './fields'
import { buttonClasses } from './form-styles'
import {
  AboutForm,
  CtaForm,
  HeroForm,
  LiveForm,
  PrinciplesForm,
  RoomForm,
  StudioForm,
} from './sections'

async function fetchContent(page: string): Promise<unknown> {
  const res = await fetch(`/api/content?page=${page}`, { cache: 'no-store' })
  if (!res.ok) return null
  const data = await res.json()
  return data.content ?? null
}

export default function SiteContentAdmin() {
  const { user, loading, role, signOut } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<TabId>('hero')
  const [editLocale, setEditLocale] = useState<SiteLocale>('en')
  const [content, setContent] = useState<HomePageContent>(DEFAULT_HOME_CONTENT)
  const [loadingContent, setLoadingContent] = useState(true)
  const [migrated, setMigrated] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const showMessage = useCallback((text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 3000)
  }, [])

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/login')
      return
    }
    if (role !== 'admin') {
      router.push('/')
      return
    }

    const load = async () => {
      try {
        const home = await fetchContent('home')

        // Nothing saved in the new shape yet — pull whatever the pre-redesign
        // documents hold so the editor opens on the real content, not the
        // defaults. It only becomes live once the admin saves.
        if (!home || typeof home !== 'object' || !('hero' in home)) {
          const [work, bio, contact] = await Promise.all([
            fetchContent('work'),
            fetchContent('bio'),
            fetchContent('contact'),
          ])
          const legacy: LegacyContent = {
            home: (home as LegacyContent['home']) ?? undefined,
            work: (work as LegacyContent['work']) ?? undefined,
            bio: (bio as LegacyContent['bio']) ?? undefined,
            contact: (contact as LegacyContent['contact']) ?? undefined,
          }
          const patch = migrateLegacyHome(legacy)
          if (Object.keys(patch).length > 0) {
            setContent(normalizeHomeContent({ ...DEFAULT_HOME_CONTENT, ...patch }))
            setMigrated(true)
            // Carried-over content is not persisted yet, so enable the save button.
            setDirty(true)
          }
        } else {
          setContent(normalizeHomeContent(home))
        }
      } catch (err) {
        console.error('Error fetching site content:', err)
        showMessage('Could not load saved content — showing defaults')
      } finally {
        setLoadingContent(false)
      }
    }

    load()
  }, [user, loading, role, router, showMessage])

  const update = <K extends keyof HomePageContent>(key: K, value: HomePageContent[K]) => {
    setContent(current => ({ ...current, [key]: value }))
    setDirty(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ page: 'home', content }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setDirty(false)
      setMigrated(false)
      showMessage('Site content saved')
    } catch (err) {
      console.error(err)
      showMessage('Error saving content')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !user || role !== 'admin') {
    return null
  }

  const sectionProps = { locale: editLocale, onError: showMessage }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-title text-3xl tracking-tight">Site Content Editor</h1>
          <p className="mt-1 text-muted-foreground">
            Every section of the public page, in both languages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            View site <ExternalLink size={14} />
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign out <LogOut size={14} />
          </button>
          <LocaleToggle locale={editLocale} onChange={setEditLocale} />
        </div>
      </div>

      {migrated && (
        <div className="mb-6 rounded-lg border border-primary/40 bg-primary/10 px-4 py-3 text-sm">
          Content from the previous site structure has been carried over into this
          editor, copied into both languages. Review it and press save to publish.
        </div>
      )}

      <SiteContentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {loadingContent ? (
        <div className="text-sm text-muted-foreground">Loading content…</div>
      ) : (
        <>
          {activeTab === 'hero' && (
            <HeroForm
              {...sectionProps}
              value={content.hero}
              onChange={value => update('hero', value)}
            />
          )}
          {activeTab === 'about' && (
            <AboutForm
              {...sectionProps}
              value={content.about}
              onChange={value => update('about', value)}
            />
          )}
          {activeTab === 'principles' && (
            <PrinciplesForm
              {...sectionProps}
              value={content.principles}
              onChange={value => update('principles', value)}
            />
          )}
          {activeTab === 'studio' && (
            <StudioForm
              {...sectionProps}
              value={content.studio}
              onChange={value => update('studio', value)}
            />
          )}
          {activeTab === 'room' && (
            <RoomForm
              {...sectionProps}
              value={content.room}
              onChange={value => update('room', value)}
            />
          )}
          {activeTab === 'live' && (
            <LiveForm
              {...sectionProps}
              value={content.live}
              onChange={value => update('live', value)}
            />
          )}
          {activeTab === 'cta' && (
            <CtaForm
              {...sectionProps}
              value={content.cta}
              onChange={value => update('cta', value)}
            />
          )}

          {/* One document, one save — every tab writes the same `home` record. */}
          <div className="sticky bottom-0 mt-10 flex items-center justify-end gap-4 border-t border-border bg-background/90 py-4 backdrop-blur">
            <span className="text-sm text-muted-foreground">
              {dirty ? 'Unsaved changes' : 'All changes saved'}
            </span>
            <button onClick={save} disabled={saving || !dirty} className={buttonClasses}>
              {saving ? 'Saving…' : 'Save site content'}
            </button>
          </div>
        </>
      )}

      {message && (
        <div className="fixed bottom-6 right-6 rounded-lg border border-border bg-card px-4 py-2 text-sm shadow-lg">
          {message}
        </div>
      )}
    </div>
  )
}
