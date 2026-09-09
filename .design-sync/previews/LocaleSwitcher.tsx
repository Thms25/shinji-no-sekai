import { LocaleSwitcher } from 'shinji-no-sekai'

export const Default = () => (
  <div className="bg-background p-8">
    <LocaleSwitcher />
  </div>
)

export const OnCard = () => (
  <div className="rounded-2xl border border-border bg-card p-8">
    <LocaleSwitcher />
  </div>
)
