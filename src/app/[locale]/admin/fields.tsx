'use client'

import { useState } from 'react'
import { Upload as UploadIcon } from 'lucide-react'
import type { Localized } from '@/utils/db/content'
import type { SiteLocale } from '@/utils/content/home-defaults'
import {
  inputClasses,
  inputSmClasses,
  labelClasses,
  subLabelClasses,
} from './form-styles'

/* ── Locale toggle ─────────────────────────────────────────────────────────── */

export function LocaleToggle({
  locale,
  onChange,
}: {
  locale: SiteLocale
  onChange: (locale: SiteLocale) => void
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-subtle p-1">
      {(['en', 'fr'] as const).map(code => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={`font-caption rounded-full px-3 py-1 text-[11px] tracking-[.18em] transition-colors ${
            locale === code
              ? 'bg-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

/* ── Plain (locale-independent) text ───────────────────────────────────────── */

export function TextField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  small,
}: {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  small?: boolean
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className={small ? subLabelClasses : labelClasses}>{label}</label>
        {hint && <span className="text-xs text-muted-foreground/70">{hint}</span>}
      </div>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        className={small ? inputSmClasses : inputClasses}
      />
    </div>
  )
}

/* ── Localised text ────────────────────────────────────────────────────────── */

/**
 * Edits one side of a {@link Localized} pair. The other language is preserved
 * untouched, so switching the toggle never discards the copy you are not looking at.
 */
export function LocalizedField({
  label,
  value,
  locale,
  onChange,
  rows,
  placeholder,
  small,
}: {
  label: string
  value: Localized
  locale: SiteLocale
  onChange: (value: Localized) => void
  /** Renders a textarea instead of an input. */
  rows?: number
  placeholder?: string
  small?: boolean
}) {
  const other: SiteLocale = locale === 'en' ? 'fr' : 'en'
  const isEmpty = !value[locale].trim()
  const classes = small ? inputSmClasses : inputClasses

  const handle = (next: string) => onChange({ ...value, [locale]: next })

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className={small ? subLabelClasses : labelClasses}>{label}</label>
        <span className="font-caption text-[10px] uppercase tracking-[.16em] text-muted-foreground/70">
          {locale}
        </span>
      </div>

      {rows ? (
        <textarea
          rows={rows}
          value={value[locale]}
          placeholder={placeholder}
          onChange={event => handle(event.target.value)}
          className={`${classes} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value[locale]}
          placeholder={placeholder}
          onChange={event => handle(event.target.value)}
          className={classes}
        />
      )}

      {isEmpty && value[other].trim() && (
        <p className="text-xs text-muted-foreground/70">
          Empty — the site will fall back to the {other.toUpperCase()} text.
        </p>
      )}
    </div>
  )
}

/* ── Image upload ──────────────────────────────────────────────────────────── */

export function ImageField({
  label,
  value,
  onChange,
  onError,
  alt,
  hint,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  onError: (message: string) => void
  alt?: string
  hint?: string
}) {
  const [uploading, setUploading] = useState(false)

  const upload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.set('file', file)
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
      if (url) onChange(url)
    } catch (err) {
      console.error(err)
      onError(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className={labelClasses}>{label}</label>
        {hint && <span className="text-xs text-muted-foreground/70">{hint}</span>}
      </div>

      <div className="flex items-center gap-3">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-subtle">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={alt ?? label} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground/70">
              None
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-subtle px-3 py-2 text-sm font-medium transition-colors hover:bg-card">
            <UploadIcon size={16} />
            {uploading ? 'Uploading…' : value ? 'Change' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={event => {
                const file = event.target.files?.[0]
                if (file) upload(file)
                event.target.value = ''
              }}
            />
          </label>

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
