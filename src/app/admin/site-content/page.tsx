'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type {
  HomePageContent,
  WorkPageContent,
  BioPageContent,
  ContactPageContent,
} from '@/utils/db/content'
import {
  type TabId,
  DEFAULT_HOME_CONTENT,
  DEFAULT_WORK_CONTENT,
  DEFAULT_BIO_CONTENT,
  DEFAULT_CONTACT_CONTENT,
} from './content-defaults'
import { SiteContentTabs } from './SiteContentTabs'
import { HomeContentForm } from './HomeContentForm'
import { WorkContentForm } from './WorkContentForm'
import { BioContentForm } from './BioContentForm'
import { ContactContentForm } from './ContactContentForm'

export default function SiteContentAdmin() {
  const { user, loading, role } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [homeContent, setHomeContent] = useState<HomePageContent>(DEFAULT_HOME_CONTENT)
  const [workContent, setWorkContent] = useState<WorkPageContent>(DEFAULT_WORK_CONTENT)
  const [bioContent, setBioContent] = useState<BioPageContent>(DEFAULT_BIO_CONTENT)
  const [contactContent, setContactContent] =
    useState<ContactPageContent>(DEFAULT_CONTACT_CONTENT)
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
            const [homeRes, workRes, bioRes, contactRes] = await Promise.all([
              fetch('/api/content?page=home'),
              fetch('/api/content?page=work'),
              fetch('/api/content?page=bio'),
              fetch('/api/content?page=contact'),
            ])

            if (homeRes.ok) {
              const data = await homeRes.json()
              if (data.content) setHomeContent({ ...DEFAULT_HOME_CONTENT, ...data.content })
            }
            if (workRes.ok) {
              const data = await workRes.json()
              if (data.content) setWorkContent({ ...DEFAULT_WORK_CONTENT, ...data.content })
            }
            if (bioRes.ok) {
              const data = await bioRes.json()
              if (data.content) setBioContent({ ...DEFAULT_BIO_CONTENT, ...data.content })
            }
            if (contactRes.ok) {
              const data = await contactRes.json()
              if (data.content)
                setContactContent({ ...DEFAULT_CONTACT_CONTENT, ...data.content })
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

  const savePage = async (
    page: TabId,
    content: HomePageContent | WorkPageContent | BioPageContent | ContactPageContent,
  ) => {
    setSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ page, content }),
      })
      if (!res.ok) throw new Error('Failed to save')
      showMessage(`${page === 'home' ? 'Home' : page === 'work' ? 'Work' : page === 'bio' ? 'Bio' : 'Contact'} page content saved`)
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/admin"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Site Content Editor</h1>
        <p className="text-muted-foreground mt-1">
          Edit the public-facing content for the home, work, bio, and contact pages.
        </p>
      </div>

      <SiteContentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {loadingContent ? (
        <div className="text-muted-foreground text-sm">Loading content…</div>
      ) : (
        <>
          {activeTab === 'home' && (
            <HomeContentForm
              content={homeContent}
              onChange={setHomeContent}
              onSave={() => savePage('home', homeContent)}
              saving={saving}
            />
          )}
          {activeTab === 'work' && (
            <WorkContentForm
              content={workContent}
              onChange={setWorkContent}
              openIndex={openArtistIndex}
              onOpenChange={setOpenArtistIndex}
              onSave={() => savePage('work', workContent)}
              saving={saving}
              showMessage={showMessage}
            />
          )}
          {activeTab === 'bio' && (
            <BioContentForm
              content={bioContent}
              onChange={setBioContent}
              onSave={() => savePage('bio', bioContent)}
              saving={saving}
              showMessage={showMessage}
            />
          )}
          {activeTab === 'contact' && (
            <ContactContentForm
              content={contactContent}
              onChange={setContactContent}
              onSave={() => savePage('contact', contactContent)}
              saving={saving}
            />
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
