'use client'

import type { HomePageContent } from '@/utils/db/content'
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Primary CTA Label</label>
          <input
            type="text"
            value={content.ctaPrimaryLabel}
            onChange={e =>
              onChange({ ...content, ctaPrimaryLabel: e.target.value })
            }
            className={inputClasses}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Primary CTA Link</label>
          <input
            type="text"
            value={content.ctaPrimaryHref}
            onChange={e =>
              onChange({ ...content, ctaPrimaryHref: e.target.value })
            }
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Secondary CTA Label</label>
          <input
            type="text"
            value={content.ctaSecondaryLabel}
            onChange={e =>
              onChange({ ...content, ctaSecondaryLabel: e.target.value })
            }
            className={inputClasses}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Secondary CTA Link</label>
          <input
            type="text"
            value={content.ctaSecondaryHref}
            onChange={e =>
              onChange({ ...content, ctaSecondaryHref: e.target.value })
            }
            className={inputClasses}
          />
        </div>
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
