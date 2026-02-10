'use client'

import { Plus } from 'lucide-react'
import type { WorkPageContent, WorkArtist } from '@/utils/db/content'
import { EMPTY_WORK_ARTIST } from './content-defaults'
import { ArtistAccordionItem } from './ArtistAccordionItem'

type WorkContentFormProps = {
  content: WorkPageContent
  onChange: (content: WorkPageContent) => void
  openIndex: number | null
  onOpenChange: (index: number | null) => void
  onSave: () => void
  saving: boolean
  showMessage: (msg: string) => void
}

export function WorkContentForm({
  content,
  onChange,
  openIndex,
  onOpenChange,
  onSave,
  saving,
  showMessage,
}: WorkContentFormProps) {
  const artists = content.artists

  const handleAddArtist = () => {
    onChange({
      ...content,
      artists: [...artists, { ...EMPTY_WORK_ARTIST }],
    })
  }

  const handleUpdateArtist = (index: number, updated: Partial<WorkArtist>) => {
    const next = [...artists]
    next[index] = {
      ...next[index],
      ...updated,
      roles:
        updated.roles ?? next[index].roles ?? (updated as { roles?: string[] }).roles ?? [],
    }
    onChange({ ...content, artists: next })
  }

  const handleRemoveArtist = (index: number) => {
    onChange({
      ...content,
      artists: artists.filter((_, i) => i !== index),
    })
    if (openIndex === index) onOpenChange(null)
    else if (openIndex !== null && openIndex > index) onOpenChange(openIndex - 1)
  }

  const handleAddRole = (artistIndex: number, role: string) => {
    const trimmed = role.trim()
    if (!trimmed) return
    const current = artists[artistIndex].roles ?? []
    if (current.includes(trimmed)) return
    handleUpdateArtist(artistIndex, { roles: [...current, trimmed] })
  }

  const handleRemoveRole = (artistIndex: number, roleIndex: number) => {
    const roles = [...(artists[artistIndex].roles ?? [])]
    roles.splice(roleIndex, 1)
    handleUpdateArtist(artistIndex, { roles })
  }

  const handleMoveArtist = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
    if (toIndex < 0 || toIndex >= artists.length) return
    const next = [...artists]
    ;[next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]]
    onChange({ ...content, artists: next })
    onOpenChange(
      openIndex === fromIndex ? toIndex : openIndex === toIndex ? fromIndex : openIndex,
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
      const url = data.url ?? (data.fileId ? `/api/images/${data.fileId}` : null)
      if (url) handleUpdateArtist(artistIndex, { image: url })
    } catch (err) {
      console.error(err)
      showMessage(err instanceof Error ? err.message : 'Image upload failed')
    }
  }

  return (
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

      {artists.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No artists added yet. Click &quot;Add Artist&quot; to get started.
        </p>
      )}

      <div className="space-y-2">
        {artists.map((artist, index) => (
          <ArtistAccordionItem
            key={index}
            artist={artist}
            index={index}
            isOpen={openIndex === index}
            totalArtists={artists.length}
            onToggle={() => onOpenChange(openIndex === index ? null : index)}
            onMoveUp={() => handleMoveArtist(index, 'up')}
            onMoveDown={() => handleMoveArtist(index, 'down')}
            onRemove={() => handleRemoveArtist(index)}
            onUpdate={updated => handleUpdateArtist(index, updated)}
            onAddRole={role => handleAddRole(index, role)}
            onRemoveRole={roleIdx => handleRemoveRole(index, roleIdx)}
            onImageUpload={file => handleImageUpload(index, file)}
          />
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Work Content'}
        </button>
      </div>
    </div>
  )
}
