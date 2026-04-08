'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Trash2, X, Upload as UploadIcon } from 'lucide-react'
import type { WorkArtist } from '@/utils/db/content'
import { inputSmClasses } from './form-styles'

type ArtistAccordionItemProps = {
  artist: WorkArtist
  index: number
  isOpen: boolean
  totalArtists: number
  onToggle: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  onUpdate: (updated: Partial<WorkArtist>) => void
  onAddRole: (role: string) => void
  onRemoveRole: (roleIndex: number) => void
  onImageUpload: (file: File) => void
}

export function ArtistAccordionItem({
  artist,
  index,
  isOpen,
  totalArtists,
  onToggle,
  onMoveUp,
  onMoveDown,
  onRemove,
  onUpdate,
  onAddRole,
  onRemoveRole,
  onImageUpload,
}: ArtistAccordionItemProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle()
          }
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-subtle transition-colors cursor-pointer"
      >
        <div
          className="flex items-center gap-0.5 shrink-0"
          onClick={e => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              onMoveUp()
            }}
            disabled={index === 0}
            className="p-1.5 rounded hover:bg-border text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Move up"
          >
            <ChevronUp size={18} />
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              onMoveDown()
            }}
            disabled={index === totalArtists - 1}
            className="p-1.5 rounded hover:bg-border text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Move down"
          >
            <ChevronDown size={18} />
          </button>
        </div>
        <span className="flex-1 font-semibold">
          {artist.name || `Artist ${index + 1}`}
        </span>
        <span className="text-sm text-muted-foreground">
          {isOpen ? 'Collapse' : 'Edit'}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="shrink-0 text-muted-foreground"
        >
          <ChevronDown size={18} />
        </motion.span>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation()
            onRemove()
          }}
          className="shrink-0 p-1.5 rounded text-muted-foreground hover:text-red-400 hover:bg-border transition-colors"
          aria-label="Remove artist"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.2 },
              opacity: { duration: 0.15 },
            }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={artist.name}
                    onChange={e => onUpdate({ name: e.target.value })}
                    className={inputSmClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Roles</label>
                  <div className="flex flex-wrap gap-2">
                    {(artist.roles ?? []).map((role, roleIdx) => (
                      <span
                        key={roleIdx}
                        className="inline-flex items-center gap-1 rounded-full bg-border pl-2.5 pr-1 py-0.5 text-xs font-medium"
                      >
                        {role}
                        <button
                          type="button"
                          onClick={() => onRemoveRole(roleIdx)}
                          className="rounded-full p-0.5 hover:bg-card transition-colors"
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
                      className={`flex-1 ${inputSmClasses}`}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          onAddRole(e.currentTarget.value)
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
                          onAddRole(input.value)
                          input.value = ''
                        }
                      }}
                      className="shrink-0 px-3 py-2 rounded-lg bg-card hover:bg-border text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  rows={3}
                  value={artist.description}
                  onChange={e => onUpdate({ description: e.target.value })}
                  className={`${inputSmClasses} resize-none`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image</label>
                  <div className="flex items-center gap-3">
                    {artist.image && (
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={artist.image}
                          alt={artist.name || 'Artist'}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card hover:bg-border text-sm font-medium transition-colors">
                      <UploadIcon size={16} />
                      {artist.image ? 'Change' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) onImageUpload(file)
                          e.target.value = ''
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Spotify URL</label>
                  <input
                    type="text"
                    value={artist.spotify_url ?? ''}
                    onChange={e =>
                      onUpdate({ spotify_url: e.target.value })
                    }
                    className={inputSmClasses}
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
                      onUpdate({ spotify_id: e.target.value })
                    }
                    className={inputSmClasses}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
