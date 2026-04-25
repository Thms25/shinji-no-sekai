'use client'

import type { ContactPageContent } from '@/utils/db/content'
import { inputClasses } from './form-styles'

type ContactContentFormProps = {
  content: ContactPageContent
  onChange: (content: ContactPageContent) => void
  onSave: () => void
  saving: boolean
}

export function ContactContentForm({
  content,
  onChange,
  onSave,
  saving,
}: ContactContentFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Heading</label>
        <input
          type="text"
          value={content.heading}
          onChange={e => onChange({ ...content, heading: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Subtext</label>
        <textarea
          rows={3}
          value={content.subtext}
          onChange={e => onChange({ ...content, subtext: e.target.value })}
          className={`${inputClasses} resize-none`}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Contact Content'}
        </button>
      </div>
    </div>
  )
}
