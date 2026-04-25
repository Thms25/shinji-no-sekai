'use client'

import { motion } from 'framer-motion'
import type { TabId } from './content-defaults'
import { TAB_LABELS } from './content-defaults'

type SiteContentTabsProps = {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function SiteContentTabs({ activeTab, onTabChange }: SiteContentTabsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-1">
      {TAB_LABELS.map(([tab, label]) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`relative px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === tab
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {label}
          {activeTab === tab && (
            <motion.div
              layoutId="site-content-tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
