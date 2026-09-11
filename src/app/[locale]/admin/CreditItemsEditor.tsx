'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import type { CreditItem } from '@/utils/db/content'
import { EMPTY_CREDIT_ITEM, type SiteLocale } from '@/utils/content/home-defaults'
import { ImageField, LocalizedField, TextField } from './fields'
import { ghostButtonClasses } from './form-styles'

type CreditItemsEditorProps = {
  items: CreditItem[]
  locale: SiteLocale
  onChange: (items: CreditItem[]) => void
  onError: (message: string) => void
  /** Aspect ratio the card uses on the public page, surfaced as an upload hint. */
  imageHint: string
  addLabel: string
}

/**
 * Shared editor for the studio and live credit lists — both render the same
 * {image, artist, meta, year, url} card on the public page.
 */
export function CreditItemsEditor({
  items,
  locale,
  onChange,
  onError,
  imageHint,
  addLabel,
}: CreditItemsEditorProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const update = (index: number, patch: Partial<CreditItem>) => {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
    if (openIndex === index) setOpenIndex(null)
    else if (openIndex !== null && openIndex > index) setOpenIndex(openIndex - 1)
  }

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
    if (openIndex === index) setOpenIndex(target)
    else if (openIndex === target) setOpenIndex(index)
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nothing here yet — the section is hidden on the site until you add an entry.
        </p>
      )}

      {items.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <div key={index} className="overflow-hidden rounded-xl border border-border bg-card/60">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-subtle">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-title text-sm text-primary/70">
                    {item.artist.trim().charAt(0) || '—'}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex flex-1 items-baseline gap-3 text-left"
              >
                <span className="font-medium">{item.artist || 'Untitled entry'}</span>
                <span className="font-caption text-xs text-muted-foreground">{item.year}</span>
              </button>

              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
                className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              >
                <ChevronDown size={16} />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove entry"
                className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {isOpen && (
              <div className="space-y-4 border-t border-border px-4 py-4">
                <ImageField
                  label="Image"
                  hint={imageHint}
                  value={item.image}
                  alt={item.artist}
                  onChange={url => update(index, { image: url })}
                  onError={onError}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Artist"
                    value={item.artist}
                    onChange={value => update(index, { artist: value })}
                    placeholder="e.g. Sofiane Pamart"
                  />
                  <TextField
                    label="Year"
                    value={item.year}
                    onChange={value => update(index, { year: value })}
                    placeholder="e.g. 2026"
                  />
                </div>
                <LocalizedField
                  label="Credit line"
                  value={item.meta}
                  locale={locale}
                  onChange={meta => update(index, { meta })}
                  placeholder="e.g. Album: Movie — Mixing / Atmos"
                />
                <TextField
                  label="Link"
                  hint="Optional — makes the name clickable"
                  value={item.url ?? ''}
                  onChange={value => update(index, { url: value })}
                  placeholder="https://open.spotify.com/artist/…"
                />
              </div>
            )}
          </div>
        )
      })}

      <button
        type="button"
        onClick={() => {
          onChange([...items, { ...EMPTY_CREDIT_ITEM, meta: { en: '', fr: '' } }])
          setOpenIndex(items.length)
        }}
        className={ghostButtonClasses}
      >
        <Plus size={16} /> {addLabel}
      </button>
    </div>
  )
}
