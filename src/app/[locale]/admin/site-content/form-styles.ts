// The public palette is light (cream), so admin inputs are tinted with the site
// tokens rather than the white/5 overlays the console used when it was dark.
export const inputClasses =
  'w-full bg-subtle border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-secondary/60 focus:outline-none focus:ring-1 focus:ring-primary'
export const inputSmClasses =
  'w-full bg-subtle border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-secondary/60 focus:outline-none focus:ring-1 focus:ring-primary'
export const labelClasses = 'font-caption text-sm font-medium text-foreground'
export const subLabelClasses = 'font-caption text-xs text-muted-foreground'
export const cardClasses = 'rounded-xl border border-border bg-card/60 p-4'
export const buttonClasses =
  'bg-primary text-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-60'
export const ghostButtonClasses =
  'inline-flex items-center gap-2 rounded-lg border border-border bg-subtle px-4 py-2 text-sm font-medium hover:bg-card transition-colors'
