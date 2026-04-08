'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { HomePageContent, KeyValue, WorkPageContent, ContactPageContent, BioPageContent } from '@/utils/db/content'
import { inputClasses } from './form-styles'
import { BioContentForm } from './BioContentForm'
import { WorkContentForm } from './WorkContentForm'
import { ContactContentForm } from './ContactContentForm'

type HomeContentFormProps = {
  homeContent: HomePageContent
  onHomeChange: (content: HomePageContent) => void
  onHomeSave: () => void
  bioContent: BioPageContent
  onBioChange: (content: BioPageContent) => void
  onBioSave: () => void
  workContent: WorkPageContent
  onWorkChange: (content: WorkPageContent) => void
  openArtistIndex: number | null
  onOpenArtistChange: (index: number | null) => void
  onWorkSave: () => void
  contactContent: ContactPageContent
  onContactChange: (content: ContactPageContent) => void
  onContactSave: () => void
  saving: boolean
  showMessage: (msg: string) => void
}

export function HomeContentForm({
  homeContent,
  onHomeChange,
  onHomeSave,
  bioContent,
  onBioChange,
  onBioSave,
  workContent,
  onWorkChange,
  openArtistIndex,
  onOpenArtistChange,
  onWorkSave,
  contactContent,
  onContactChange,
  onContactSave,
  saving,
  showMessage,
}: HomeContentFormProps) {
  const updateKeyValue = (idx: number, field: keyof KeyValue, value: string) => {
    const updated = homeContent.keyValues.map((kv, i) => (i === idx ? { ...kv, [field]: value } : kv))
    onHomeChange({ ...homeContent, keyValues: updated })
  }

  const addKeyValue = () => {
    onHomeChange({ ...homeContent, keyValues: [...homeContent.keyValues, { title: '', description: '' }] })
  }

  const removeKeyValue = (idx: number) => {
    onHomeChange({ ...homeContent, keyValues: homeContent.keyValues.filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-12">
      {/* Hero section */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Hero</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Headline</label>
          <input
            type="text"
            value={homeContent.headline}
            onChange={e => onHomeChange({ ...homeContent, headline: e.target.value })}
            className={inputClasses}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Subheadline</label>
          <textarea
            rows={3}
            value={homeContent.subheadline}
            onChange={e => onHomeChange({ ...homeContent, subheadline: e.target.value })}
            className={`${inputClasses} resize-none`}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Key Values</label>
            <button
              type="button"
              onClick={addKeyValue}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Plus size={14} /> Add value
            </button>
          </div>

          {homeContent.keyValues.map((kv, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Title"
                  value={kv.title}
                  onChange={e => updateKeyValue(idx, 'title', e.target.value)}
                  className={inputClasses}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={kv.description}
                  onChange={e => updateKeyValue(idx, 'description', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <button
                type="button"
                onClick={() => removeKeyValue(idx)}
                className="mt-3 text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {homeContent.keyValues.length === 0 && (
            <p className="text-sm text-muted-foreground">No key values yet. Add one above.</p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onHomeSave}
            disabled={saving}
            className="bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Hero'}
          </button>
        </div>
      </section>

      {/* Bio section */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Bio</h2>
        <BioContentForm
          content={bioContent}
          onChange={onBioChange}
          onSave={onBioSave}
          saving={saving}
          showMessage={showMessage}
        />
      </section>

      {/* Work section */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Work</h2>
        <WorkContentForm
          content={workContent}
          onChange={onWorkChange}
          openIndex={openArtistIndex}
          onOpenChange={onOpenArtistChange}
          onSave={onWorkSave}
          saving={saving}
          showMessage={showMessage}
        />
      </section>

      {/* Contact section */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold border-b border-border pb-2">Contact</h2>
        <ContactContentForm
          content={contactContent}
          onChange={onContactChange}
          onSave={onContactSave}
          saving={saving}
        />
      </section>
    </div>
  )
}
