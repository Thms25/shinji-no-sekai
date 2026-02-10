'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { createArtist } from '@/utils/actions/admin-actions'

export default function CreateArtistModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [createState, setCreateState] = useState<{
    error?: string
    success?: boolean
    message?: string
  } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCreateArtist(formData: FormData) {
    setLoading(true)
    setCreateState(null)

    try {
      const result = await createArtist(formData)
      if (result.success) {
        setCreateState({ success: true, message: result.message })
        // Close modal after short delay or immediately
        setTimeout(() => {
          setIsOpen(false)
          setCreateState(null)
          // Force a router refresh to update the list if it's a server component
          window.location.reload()
        }, 1000)
      } else {
        setCreateState({ error: result.error })
      }
    } catch (e: unknown) {
      setCreateState({
        error: e instanceof Error ? e.message : 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-colors font-medium"
      >
        <Plus size={18} /> New Artist
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Create New Artist</h2>

            {createState?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">
                {createState.error}
              </div>
            )}

            {createState?.success && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-3 rounded-lg mb-4 text-sm">
                {createState.message}
              </div>
            )}

            <form action={handleCreateArtist} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Artist Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2"
                  placeholder="Stage Name"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2"
                  placeholder="artist@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2"
                  placeholder="Temporary Password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Artist'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
