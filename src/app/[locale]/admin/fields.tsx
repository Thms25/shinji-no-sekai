'use client'

import { useState } from 'react'
import { Plus, Upload as UploadIcon, X } from 'lucide-react'
import type { CreditLine, Localized } from '@/utils/db/content'
import type { SiteLocale } from '@/utils/content/home-defaults'
import {
  ghostButtonClasses,
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

/* ── Credit lines ──────────────────────────────────────────────────────────── */

type CreditPlaceholder = { credit: string; role: string }

/**
 * One line per release or role, each in two parts: the credit ("Album: Movie",
 * "Summer Tour") and Shinji's role on it ("Mixing / Atmos", "FOH"), which the site
 * sets apart. Empty lines are skipped on the site. Used by the projects and the
 * live work lists.
 */
export function CreditLinesField({
  credits,
  locale,
  onChange,
  placeholders = [
    { credit: 'e.g. Album: Movie', role: 'e.g. Mixing / Atmos' },
    { credit: 'e.g. Single: Rouge', role: 'e.g. Recording' },
  ],
}: {
  credits: CreditLine[]
  locale: SiteLocale
  onChange: (credits: CreditLine[]) => void
  /** For the first line, then for every added one. */
  placeholders?: [CreditPlaceholder, CreditPlaceholder]
}) {
  const other: SiteLocale = locale === 'en' ? 'fr' : 'en'
  const set = (index: number, field: keyof CreditLine, text: string) =>
    onChange(
      credits.map((line, i) =>
        i === index ? { ...line, [field]: { ...line[field], [locale]: text } } : line,
      ),
    )
  const remove = (index: number) => onChange(credits.filter((_, i) => i !== index))
  const fallsBack = (value: Localized) => !value[locale].trim() && value[other].trim()

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className={labelClasses}>Credit lines</span>
        <span className="font-caption text-[10px] uppercase tracking-[.16em] text-muted-foreground/70">
          {locale}
        </span>
      </div>
      <div
        aria-hidden
        className="hidden grid-cols-[minmax(0,3fr)_minmax(0,2fr)_32px] gap-2 md:grid"
      >
        <span className={subLabelClasses}>Credit</span>
        <span className={subLabelClasses}>Role (stands out on the site)</span>
      </div>

      {credits.map((line, index) => {
        const hint = placeholders[index === 0 ? 0 : 1]
        return (
          <div key={index} className="space-y-1">
            <div className="grid grid-cols-[minmax(0,1fr)_32px] gap-2 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)_32px]">
              <input
                type="text"
                value={line.credit[locale]}
                aria-label={`Credit ${index + 1}`}
                placeholder={hint.credit}
                onChange={event => set(index, 'credit', event.target.value)}
                className={`${inputClasses} col-start-1`}
              />
              <input
                type="text"
                value={line.role[locale]}
                aria-label={`Role ${index + 1}`}
                placeholder={hint.role}
                onChange={event => set(index, 'role', event.target.value)}
                className={`${inputClasses} col-start-1 md:col-start-2 md:row-start-1`}
              />
              {credits.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={`Remove credit line ${index + 1}`}
                  className="col-start-2 row-span-2 row-start-1 self-center justify-self-center rounded p-2 text-muted-foreground transition-colors hover:text-foreground md:col-start-3 md:row-span-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {(fallsBack(line.credit) || fallsBack(line.role)) && (
              <p className="text-xs text-muted-foreground/70">
                Empty — the site will fall back to the {other.toUpperCase()} text.
              </p>
            )}
          </div>
        )
      })}

      <button
        type="button"
        onClick={() =>
          onChange([...credits, { credit: { en: '', fr: '' }, role: { en: '', fr: '' } }])
        }
        className={ghostButtonClasses}
      >
        <Plus size={14} />
        Add credit line
      </button>
    </div>
  )
}

/* ── Image upload ──────────────────────────────────────────────────────────── */

/** Uploads one image to the GridFS bucket and returns the URL it is served from. */
export async function uploadImage(file: File): Promise<string> {
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
  const url: string | null = data.url ?? (data.fileId ? `/api/images/${data.fileId}` : null)
  if (!url) throw new Error('Upload failed')
  return url
}

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
      onChange(await uploadImage(file))
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
