import { creditText, type CreditText } from '@/utils/content/home-defaults'

/**
 * Credit lines as plain text, the way the single credit line always read:
 * "Album: MOVIE — Mixing / Atmos". The admin keeps credit and role apart; the
 * page sets them back together.
 *
 * `inline` runs the lines together on one row (for single-line spots that
 * truncate); otherwise each line is a list item of its own.
 */
export function Credits({
  lines,
  inline = false,
  className = '',
}: {
  lines: CreditText[]
  inline?: boolean
  className?: string
}) {
  if (lines.length === 0) return null

  if (inline) {
    return <span className={className}>{lines.map(creditText).join(' · ')}</span>
  }

  return (
    <ul className={className}>
      {lines.map((line, i) => (
        <li key={i}>{creditText(line)}</li>
      ))}
    </ul>
  )
}
