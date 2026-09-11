'use client'

import { Plus, Trash2 } from 'lucide-react'
import type {
  AboutContent,
  CtaContent,
  HeroContent,
  LiveSection,
  PrincipleItem,
  RoomContent,
  StudioSection,
} from '@/utils/db/content'
import {
  EMPTY_PRINCIPLE,
  PRINCIPLE_NUMERALS,
  type SiteLocale,
} from '@/utils/content/home-defaults'
import { CreditItemsEditor } from './CreditItemsEditor'
import { ImageField, LocalizedField, TextField } from './fields'
import { ghostButtonClasses, labelClasses } from './form-styles'

type SectionProps<T> = {
  value: T
  locale: SiteLocale
  onChange: (value: T) => void
  onError: (message: string) => void
}

function SectionIntro({ title, children }: { title: string; children: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-title text-xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{children}</p>
    </div>
  )
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */

export function HeroForm({ value, locale, onChange }: SectionProps<HeroContent>) {
  return (
    <div className="space-y-6">
      <SectionIntro title="Hero">
        The first screen: a small kicker, the name, and the role line beneath it.
      </SectionIntro>

      <LocalizedField
        label="Kicker"
        value={value.kicker}
        locale={locale}
        onChange={kicker => onChange({ ...value, kicker })}
        placeholder="e.g. Brussels · Studio & stage"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Name — first part"
          value={value.nameLead}
          onChange={nameLead => onChange({ ...value, nameLead })}
        />
        <TextField
          label="Name — accented part"
          hint="Shown in the accent colour on desktop"
          value={value.nameAccent}
          onChange={nameAccent => onChange({ ...value, nameAccent })}
        />
      </div>

      <LocalizedField
        label="Role line"
        value={value.role}
        locale={locale}
        onChange={role => onChange({ ...value, role })}
        placeholder="e.g. Recording / Mixing / FOH Engineer"
      />
    </div>
  )
}

/* ── About ─────────────────────────────────────────────────────────────────── */

export function AboutForm({ value, locale, onChange, onError }: SectionProps<AboutContent>) {
  return (
    <div className="space-y-6">
      <SectionIntro title="About">
        The portrait and the biography. The same image is used in the desktop hero.
      </SectionIntro>

      <ImageField
        label="Portrait"
        hint="Portrait crop, shown tall"
        value={value.image}
        alt="Portrait"
        onChange={image => onChange({ ...value, image })}
        onError={onError}
      />

      <LocalizedField
        label="Section label"
        value={value.label}
        locale={locale}
        onChange={label => onChange({ ...value, label })}
        placeholder="e.g. About"
      />

      <LocalizedField
        label="Lead sentence"
        rows={3}
        value={value.lead}
        locale={locale}
        onChange={lead => onChange({ ...value, lead })}
      />

      <LocalizedField
        label="Paragraph 1"
        rows={5}
        value={value.paragraph1}
        locale={locale}
        onChange={paragraph1 => onChange({ ...value, paragraph1 })}
      />

      <LocalizedField
        label="Paragraph 2"
        rows={5}
        value={value.paragraph2}
        locale={locale}
        onChange={paragraph2 => onChange({ ...value, paragraph2 })}
      />
    </div>
  )
}

/* ── Principles ────────────────────────────────────────────────────────────── */

export function PrinciplesForm({
  value,
  locale,
  onChange,
}: SectionProps<PrincipleItem[]>) {
  const update = (index: number, patch: Partial<PrincipleItem>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  return (
    <div className="space-y-6">
      <SectionIntro title="Principles">
        The numbered values under the biography. Numerals follow the order below.
      </SectionIntro>

      <div className="space-y-3">
        {value.map((principle, index) => (
          <div key={index} className="rounded-xl border border-border bg-card/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-title text-2xl text-primary">
                {PRINCIPLE_NUMERALS[index] ?? index + 1}
              </span>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                aria-label="Remove principle"
                className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <LocalizedField
                label="Title"
                value={principle.title}
                locale={locale}
                onChange={title => update(index, { title })}
                placeholder="e.g. Human connection"
              />
              <LocalizedField
                label="Body"
                value={principle.body}
                locale={locale}
                onChange={body => update(index, { body })}
                placeholder="e.g. The prerequisite to everything else."
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            onChange([
              ...value,
              { title: { ...EMPTY_PRINCIPLE.title }, body: { ...EMPTY_PRINCIPLE.body } },
            ])
          }
          className={ghostButtonClasses}
        >
          <Plus size={16} /> Add principle
        </button>
      </div>
    </div>
  )
}

/* ── Studio work ───────────────────────────────────────────────────────────── */

export function StudioForm({ value, locale, onChange, onError }: SectionProps<StudioSection>) {
  return (
    <div className="space-y-6">
      <SectionIntro title="Studio work">
        Selected records, shown as square cards with a credit line and a year.
      </SectionIntro>

      <LocalizedField
        label="Heading"
        value={value.title}
        locale={locale}
        onChange={title => onChange({ ...value, title })}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <LocalizedField
          label="Link label"
          value={value.linkLabel}
          locale={locale}
          onChange={linkLabel => onChange({ ...value, linkLabel })}
        />
        <TextField
          label="Link URL"
          hint="Leave empty to hide the link"
          value={value.linkUrl}
          onChange={linkUrl => onChange({ ...value, linkUrl })}
          placeholder="https://open.spotify.com/…"
        />
      </div>

      <div className="space-y-3">
        <span className={labelClasses}>Entries</span>
        <CreditItemsEditor
          items={value.items}
          locale={locale}
          onChange={items => onChange({ ...value, items })}
          onError={onError}
          imageHint="Square crop"
          addLabel="Add studio credit"
        />
      </div>
    </div>
  )
}

/* ── The room ──────────────────────────────────────────────────────────────── */

export function RoomForm({ value, locale, onChange, onError }: SectionProps<RoomContent>) {
  return (
    <div className="space-y-6">
      <SectionIntro title="The room">
        The studio photograph and the paragraph describing the setup.
      </SectionIntro>

      <ImageField
        label="Photograph"
        hint="Landscape crop"
        value={value.image}
        alt="The room"
        onChange={image => onChange({ ...value, image })}
        onError={onError}
      />

      <LocalizedField
        label="Heading"
        value={value.title}
        locale={locale}
        onChange={title => onChange({ ...value, title })}
      />

      <LocalizedField
        label="Body"
        rows={5}
        value={value.body}
        locale={locale}
        onChange={body => onChange({ ...value, body })}
      />
    </div>
  )
}

/* ── Live work ─────────────────────────────────────────────────────────────── */

export function LiveForm({ value, locale, onChange, onError }: SectionProps<LiveSection>) {
  return (
    <div className="space-y-6">
      <SectionIntro title="Live work">
        Tours and shows, shown as tall cards in a four-across grid.
      </SectionIntro>

      <div className="grid gap-4 md:grid-cols-2">
        <LocalizedField
          label="Heading"
          value={value.title}
          locale={locale}
          onChange={title => onChange({ ...value, title })}
        />
        <LocalizedField
          label="Kicker"
          value={value.kicker}
          locale={locale}
          onChange={kicker => onChange({ ...value, kicker })}
          placeholder="e.g. FOH · Monitors · Tours"
        />
      </div>

      <div className="space-y-3">
        <span className={labelClasses}>Entries</span>
        <CreditItemsEditor
          items={value.items}
          locale={locale}
          onChange={items => onChange({ ...value, items })}
          onError={onError}
          imageHint="Portrait crop (3:4)"
          addLabel="Add live credit"
        />
      </div>
    </div>
  )
}

/* ── Contact ───────────────────────────────────────────────────────────────── */

export function CtaForm({ value, locale, onChange }: SectionProps<CtaContent>) {
  return (
    <div className="space-y-6">
      <SectionIntro title="Contact">
        The closing panel. The address becomes a mailto button.
      </SectionIntro>

      <LocalizedField
        label="Heading"
        value={value.title}
        locale={locale}
        onChange={title => onChange({ ...value, title })}
      />

      <LocalizedField
        label="Body"
        rows={3}
        value={value.body}
        locale={locale}
        onChange={body => onChange({ ...value, body })}
      />

      <TextField
        label="Email address"
        value={value.email}
        onChange={email => onChange({ ...value, email })}
        placeholder="hello@sekai-studios.com"
      />
    </div>
  )
}
