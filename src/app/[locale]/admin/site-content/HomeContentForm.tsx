'use client'

import type { HomePageContent, KeyValue } from '@/utils/db/content'
import { inputClasses } from './form-styles'

type HomeContentFormProps = {
  content: HomePageContent
  onChange: (content: HomePageContent) => void
  onSave: () => void
  saving: boolean
}

export function HomeContentForm({
  content,
  onChange,
  onSave,
  saving,
}: HomeContentFormProps) {
  const keyValues: KeyValue[] = content.keyValues ?? []

  const updateKeyValue = (idx: number, field: keyof KeyValue, value: string) => {
    const updated = keyValues.map((kv, i) =>
      i === idx ? { ...kv, [field]: value } : kv,
    )
    onChange({ ...content, keyValues: updated })
  }

  const addKeyValue = () => {
    onChange({ ...content, keyValues: [...keyValues, { title: '', description: '' }] })
  }

  const removeKeyValue = (idx: number) => {
    onChange({ ...content, keyValues: keyValues.filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Headline</label>
        <input
          type="text"
          value={content.headline}
          onChange={e => onChange({ ...content, headline: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Subheadline</label>
        <textarea
          rows={3}
          value={content.subheadline}
          onChange={e => onChange({ ...content, subheadline: e.target.value })}
          className={`${inputClasses} resize-none`}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Key Values</label>
          <button
            type="button"
            onClick={addKeyValue}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            + Add
          </button>
        </div>

        {keyValues.map((kv, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-border rounded-lg bg-subtle relative">
            <button
              type="button"
              onClick={() => removeKeyValue(idx)}
              className="absolute top-2 right-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Title</label>
              <input
                type="text"
                value={kv.title}
                onChange={e => updateKeyValue(idx, 'title', e.target.value)}
                className={inputClasses}
                placeholder="e.g. Human connection"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Description</label>
              <input
                type="text"
                value={kv.description}
                onChange={e => updateKeyValue(idx, 'description', e.target.value)}
                className={inputClasses}
                placeholder="e.g. The prerequisite to everything else."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Home Content'}
        </button>
      </div>
    </div>
  )
}
