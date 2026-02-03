'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import TrackList from '@/components/TrackList'
import { Track } from '@/utils/type-utils'
import Breadcrumb from '@/components/Breadcrumb'
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import CreateTrackModal from '@/components/admin/CreateTrackModal'
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
  const [artistName, setArtistName] = useState<string>(id)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (role !== 'admin') {
        router.push('/dashboard')
      } else {
        // Fetch tracks and artist details
        const fetchData = async () => {
          // Fetch Artist Name
          try {
            const artistDoc = await getDoc(doc(db, 'users', id))
            if (artistDoc.exists()) {
              const data = artistDoc.data()
              setArtistName(data.displayName || data.email || id)
            }
          } catch (err) {
            console.error('Error fetching artist:', err)
          }

          // Fetch Tracks
          const q = query(collection(db, 'tracks'), where('artistId', '==', id))
          const snapshot = await getDocs(q)
          const fetchedTracks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as Track[]
          setTracks(fetchedTracks)
        }
        fetchData()
      }
    }
  }, [user, loading, role, router, id])

  if (loading || !user || role !== 'admin') {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumb
        items={[{ label: 'Artists', href: '/admin' }, { label: artistName }]}
        className="mb-6"
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Artist: {artistName}
          </h1>
          <p className="text-muted-foreground mt-1">Manage tracks</p>
        </div>

        <CreateTrackModal artistId={id} />
      </div>

      <TrackList tracks={tracks} basePath="/dashboard/track" />
    </div>
  )
}
