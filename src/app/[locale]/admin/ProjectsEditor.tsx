'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ArrowDownWideNarrow,
  Home,
  Plus,
  Trash2,
  Upload as UploadIcon,
  X,
} from 'lucide-react'
import type { ProjectItem } from '@/utils/db/content'
import {
  createProject,
  MAX_FEATURED_PROJECTS,
  projectYear,
  type SiteLocale,
} from '@/utils/content/home-defaults'
import { LocalizedField, TextField, uploadImage } from './fields'
import { ghostButtonClasses, labelClasses } from './form-styles'

/* ── Photo set ─────────────────────────────────────────────────────────────── */

/**
 * Several photographs at once: pick any number of files, they upload one after
 * the other and land at the end of the set. The first photograph is the cover.
 */
function GalleryField({
  images,
  onChange,
  onError,
}: {
  images: string[]
  onChange: (images: string[]) => void
  onError: (message: string) => void
}) {
  const [pending, setPending] = useState(0)

  const uploadAll = async (files: File[]) => {
    setPending(files.length)
    let next = [...images]
    for (const file of files) {
      try {
        next = [...next, await uploadImage(file)]
        onChange(next)
      } catch (err) {
        console.error(err)
        onError(err instanceof Error ? err.message : `Could not upload ${file.name}`)
      } finally {
        setPending(count => count - 1)
      }
    }
  }

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= images.length) return
    const next = [...images]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className={labelClasses}>Photos</span>
        <span className="text-xs text-muted-foreground/70">
          The first one is the cover · any number
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {images.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-subtle"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            {index === 0 && (
              <span className="font-caption absolute top-1.5 left-1.5 rounded-full bg-background/90 px-2 py-0.5 text-[10px] uppercase tracking-[.14em]">
                Cover
              </span>
            )}
            <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move photo earlier"
                  className="rounded-full bg-background/90 p-1 disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === images.length - 1}
                  aria-label="Move photo later"
                  className="rounded-full bg-background/90 p-1 disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onChange(images.filter((_, i) => i !== index))}
                aria-label="Remove photo"
                className="rounded-full bg-background/90 p-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-subtle text-xs text-muted-foreground transition-colors hover:bg-card hover:text-foreground">
          <UploadIcon size={18} />
          {pending > 0 ? `Uploading ${pending}…` : 'Add photos'}
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={pending > 0}
            onChange={event => {
              const files = Array.from(event.target.files ?? [])
              event.target.value = ''
              if (files.length) uploadAll(files)
            }}
          />
        </label>
      </div>
    </div>
  )
}

/* ── One project ───────────────────────────────────────────────────────────── */

function ProjectRow({
  project,
  locale,
  open,
  canMoveUp,
  canMoveDown,
  canFeature,
  onToggle,
  onChange,
  onMove,
  onRemove,
  onError,
}: {
  project: ProjectItem
  locale: SiteLocale
  open: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  /** False when the home page is full and this project is not on it. */
  canFeature: boolean
  onToggle: () => void
  onChange: (patch: Partial<ProjectItem>) => void
  onMove: (direction: -1 | 1) => void
  onRemove: () => void
  onError: (message: string) => void
}) {
  const cover = project.images[0]

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/60">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md border border-border bg-subtle">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-title text-sm text-primary/70">
              {project.title.trim().charAt(0) || '—'}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 text-left"
        >
          <span className="truncate font-medium">{project.title || 'Untitled project'}</span>
          <span className="font-caption text-xs text-muted-foreground">
            {project.year || 'no year'} · {project.images.length}{' '}
            {project.images.length === 1 ? 'photo' : 'photos'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onChange({ featured: !project.featured })}
          disabled={!project.featured && !canFeature}
          title={
            project.featured
              ? 'Remove from the home page'
              : canFeature
                ? 'Show on the home page'
                : `The home page already shows ${MAX_FEATURED_PROJECTS} — remove one first`
          }
          className={`font-caption inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] tracking-[.06em] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            project.featured
              ? 'border-primary bg-primary text-foreground'
              : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Home size={12} />
          {project.featured ? 'On home' : 'Add to home'}
        </button>

        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={!canMoveUp}
          aria-label="Move up"
          className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ChevronUp size={16} />
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={!canMoveDown}
          aria-label="Move down"
          className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ChevronDown size={16} />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove project"
          className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {open && (
        <div className="space-y-4 border-t border-border px-4 py-4">
          <GalleryField
            images={project.images}
            onChange={images => onChange({ images })}
            onError={onError}
          />
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <TextField
              label="Artist / project"
              value={project.title}
              onChange={title => onChange({ title })}
              placeholder="e.g. Sofiane Pamart"
            />
            <TextField
              label="Year"
              hint="Optional — used by “Order by date”"
              value={project.year}
              onChange={year => onChange({ year })}
              placeholder="e.g. 2026"
            />
          </div>
          <LocalizedField
            label="Credit line"
            value={project.meta}
            locale={locale}
            onChange={meta => onChange({ meta })}
            placeholder="e.g. Album: Movie — Mixing / Atmos"
          />
          <LocalizedField
            label="Story"
            rows={4}
            value={project.story}
            locale={locale}
            onChange={story => onChange({ story })}
            placeholder="A few lines about the moment — projects page only"
          />
          <TextField
            label="Link"
            hint="Optional — adds a Listen button"
            value={project.url}
            onChange={url => onChange({ url })}
            placeholder="https://open.spotify.com/album/…"
          />
        </div>
      )}
    </div>
  )
}

/* ── The list ──────────────────────────────────────────────────────────────── */

/**
 * Every project, split in two: the ones on the home page (three at most, in the
 * order the home page shows them) and the ones only on the projects page. Both
 * groups are one list underneath, so a project keeps its place when it moves
 * between them. The projects page shows all of them, newest first.
 */
export function ProjectsEditor({
  projects,
  locale,
  onChange,
  onError,
}: {
  projects: ProjectItem[]
  locale: SiteLocale
  onChange: (projects: ProjectItem[]) => void
  onError: (message: string) => void
}) {
  const [openId, setOpenId] = useState<string | null>(null)

  const featuredCount = projects.filter(project => project.featured).length
  const homeFull = featuredCount >= MAX_FEATURED_PROJECTS

  const update = (id: string, patch: Partial<ProjectItem>) => {
    onChange(projects.map(project => (project.id === id ? { ...project, ...patch } : project)))
  }

  /** Swaps with the nearest neighbour in the same group, so each group reorders on its own. */
  const move = (id: string, direction: -1 | 1) => {
    const index = projects.findIndex(project => project.id === id)
    const featured = projects[index].featured
    let target = index + direction
    while (target >= 0 && target < projects.length && projects[target].featured !== featured) {
      target += direction
    }
    if (target < 0 || target >= projects.length) return
    const next = [...projects]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  /** Newest year first; projects with the same year (or none) keep their order. */
  const orderByDate = () => {
    onChange(
      projects
        .map((project, index) => ({ project, index }))
        .sort((a, b) => projectYear(b.project) - projectYear(a.project) || a.index - b.index)
        .map(({ project }) => project),
    )
  }

  const add = () => {
    const project = createProject()
    onChange([project, ...projects])
    setOpenId(project.id)
  }

  const renderGroup = (group: ProjectItem[]) =>
    group.map((project, index) => (
      <ProjectRow
        key={project.id}
        project={project}
        locale={locale}
        open={openId === project.id}
        canMoveUp={index > 0}
        canMoveDown={index < group.length - 1}
        canFeature={!homeFull}
        onToggle={() => setOpenId(openId === project.id ? null : project.id)}
        onChange={patch => update(project.id, patch)}
        onMove={direction => move(project.id, direction)}
        onRemove={() => {
          onChange(projects.filter(item => item.id !== project.id))
          if (openId === project.id) setOpenId(null)
        }}
        onError={onError}
      />
    ))

  const featured = projects.filter(project => project.featured)
  const others = projects.filter(project => !project.featured)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={add} className={ghostButtonClasses}>
          <Plus size={16} /> Add project
        </button>
        <button
          type="button"
          onClick={orderByDate}
          title="Sorts both lists by year, newest first. Review, then save."
          className={ghostButtonClasses}
        >
          <ArrowDownWideNarrow size={16} /> Order by date
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <span className={labelClasses}>On the home page</span>
          <span
            className={`font-caption rounded-full px-2.5 py-0.5 text-xs ${
              homeFull ? 'bg-primary text-foreground' : 'bg-subtle text-muted-foreground'
            }`}
          >
            {featuredCount} / {MAX_FEATURED_PROJECTS}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          These fill the studio section of the home page, in this order, using each
          cover photo. They are on the projects page too.
        </p>
        {featured.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
            None yet — use “Add to home” on a project below. The studio section is
            empty until you do.
          </p>
        ) : (
          renderGroup(featured)
        )}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <span className={labelClasses}>Projects page only</span>
          <span className="font-caption rounded-full bg-subtle px-2.5 py-0.5 text-xs text-muted-foreground">
            {others.length}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          The rest of the story. The projects page shows the home-page picks first,
          then these, in this order — drag them with the arrows, or use “Order by
          date”.
        </p>
        {others.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-5 text-sm text-muted-foreground">
            Nothing else yet — new projects land here.
          </p>
        ) : (
          renderGroup(others)
        )}
      </div>
    </div>
  )
}
