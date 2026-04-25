'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/contexts/AuthContext'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, role, signOut } = useAuth()
  const t = useTranslations('nav')

  const baseLinks = [
    { href: '/', label: t('home') },
    { href: '/work', label: t('work') },
    { href: '/bio', label: t('bio') },
    { href: '/contact', label: t('contact') },
  ]

  const navLinks = [...baseLinks]
  if (user) {
    if (role === 'admin') {
      navLinks.push({ href: '/admin', label: t('admin') })
    } else {
      navLinks.push({ href: '/dashboard', label: t('dashboard') })
    }
  } else {
    navLinks.push({ href: '/login', label: t('login') })
  }

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <Link
              href="/"
              className="text-xl font-bold tracking-tighter hover:text-primary transition-colors"
            >
              SHINJI NO SEKAI
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => signOut()}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('logout')}
              </button>
            )}
            <div className="ml-4">
              <LocaleSwitcher />
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-background border-b border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-white/10 text-primary'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  signOut()
                  setIsOpen(false)
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                {t('logout')}
              </button>
            )}
            <div className="px-3 py-2">
              <LocaleSwitcher />
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
