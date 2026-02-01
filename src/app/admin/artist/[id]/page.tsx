'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import TrackList, { Track } from '@/components/TrackList'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import CreateTrackModal from '@/components/admin/CreateTrackModal'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function AdminArtistView({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { user, loading, role } = useAuth()
  const router = useRouter()
  const [tracks, setTracks] = useState<Track[]>([])

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (role !== 'admin') {
        router.push('/dashboard')
      } else {
        // Fetch tracks
        const fetchTracks = async () => {
          const q = query(collection(db, 'tracks'), where('artistId', '==', id))
          const snapshot = await getDocs(q)
          const fetchedTracks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Track[]
          setTracks(fetchedTracks)
        }
        fetchTracks()
      }
    }
  }, [user, loading, role, router, id])

  if (loading || !user || role !== 'admin') {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/admin"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft size={16} className="mr-1" /> Back to Artists
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artist: {id}</h1>
          <p className="text-muted-foreground mt-1">Manage tracks</p>
        </div>

        <CreateTrackModal artistId={id} />
      </div>

      <TrackList tracks={tracks} basePath="/dashboard/track" />
    </div>
  )
}
