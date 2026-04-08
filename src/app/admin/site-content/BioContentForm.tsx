'use client'

import { useState } from 'react'
import { Upload as UploadIcon } from 'lucide-react'
import type { BioPageContent } from '@/utils/db/content'
import { inputClasses } from './form-styles'

type BioContentFormProps = {
  content: BioPageContent
  onChange: (content: BioPageContent) => void
  onSave: () => void
  saving: boolean
  showMessage: (msg: string) => void
}

export function BioContentForm({
  content,
  onChange,
  onSave,
  saving,
  showMessage,
}: BioContentFormProps) {
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
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
      if (url) onChange({ ...content, image: url })
    } catch (err) {
      console.error(err)
      showMessage(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <input
          type="text"
          value={content.title}
          onChange={e => onChange({ ...content, title: e.target.value })}
          className={inputClasses}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Image</label>
        <div className="flex items-center gap-3">
          {content.image && (
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-border border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.image}
                alt={content.title || 'Bio'}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card hover:bg-border text-sm font-medium transition-colors disabled:opacity-60">
            <UploadIcon size={16} />
            {uploading ? 'Uploading…' : content.image ? 'Change' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleImageUpload(file)
                e.target.value = ''
              }}
            />
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Paragraph 1</label>
        <textarea
          rows={4}
          value={content.paragraph1}
          onChange={e =>
            onChange({ ...content, paragraph1: e.target.value })
          }
          className={`${inputClasses} resize-none`}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Paragraph 2</label>
        <textarea
          rows={4}
          value={content.paragraph2}
          onChange={e =>
            onChange({ ...content, paragraph2: e.target.value })
          }
          className={`${inputClasses} resize-none`}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Bio Content'}
        </button>
      </div>
    </div>
  )
}
