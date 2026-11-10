import type { Metadata } from 'next'

// Private screens: kept out of search results (robots.txt also asks crawlers not to visit).
export const metadata: Metadata = {
  title: 'Sign in | Sekai Studios',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
