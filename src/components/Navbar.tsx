'use client'

import { LocaleSwitcher } from '@/components/LocaleSwitcher'

export default function Navbar() {
  return (
    <nav className="fixed top-0 right-0 z-50 p-6 sm:p-8">
      <LocaleSwitcher />
    </nav>
  )
}
