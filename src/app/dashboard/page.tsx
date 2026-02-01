'use client'

import { Track } from '@/utils/type-utils'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TrackList from '@/components/TrackList'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function Dashboard() {
  const { user, loading, role } = useAuth()
  console.log(user)

  const router = useRouter()
  const [tracks, setTracks] = useState<Track[]>([])

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (role === 'admin') {
        router.push('/admin')
      } else {
        // Fetch tracks for artist
        const fetchTracks = async () => {
          const q = query(
            collection(db, 'tracks'),
            where('artistId', '==', user.uid),
          )
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
  }, [user, loading, role, router])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Artist Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.email}
          </p>
        </div>
      </div>

      <TrackList tracks={tracks} />
    </div>
  )
}
