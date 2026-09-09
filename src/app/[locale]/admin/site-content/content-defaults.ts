export type TabId =
  | 'hero'
  | 'about'
  | 'principles'
  | 'studio'
  | 'room'
  | 'live'
  | 'cta'

/** Tab order matches the order the sections appear on the public page. */
export const TAB_LABELS: [TabId, string][] = [
  ['hero', 'Hero'],
  ['about', 'About'],
  ['principles', 'Principles'],
  ['studio', 'Studio work'],
  ['room', 'The room'],
  ['live', 'Live work'],
  ['cta', 'Contact'],
]

export {
  DEFAULT_HOME_CONTENT,
  EMPTY_CREDIT_ITEM,
  EMPTY_PRINCIPLE,
  migrateLegacyHome,
  normalizeHomeContent,
  PRINCIPLE_NUMERALS,
  type SiteLocale,
} from '@/utils/content/home-defaults'
