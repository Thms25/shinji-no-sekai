'use client'

// Provider chain for design-sync preview cards, mirroring src/app/[locale]/layout.tsx.
//
// Beyond the app's own NextIntlClientProvider + AuthProvider, this also supplies the
// Next app-router contexts. AuthContext and LocaleSwitcher call useRouter()/usePathname()
// from next/navigation, and useRouter() THROWS ("invariant expected app router to be
// mounted") when its context is absent — outside a Next runtime nothing provides it, so
// without these stubs every card that reaches those hooks renders blank.

import * as React from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {
  PathnameContext,
  SearchParamsContext,
  PathParamsContext,
} from 'next/dist/shared/lib/hooks-client-context.shared-runtime'
import messages from '../messages/en.json'

const noop = () => {}

// Matches the AppRouterInstance surface; navigation is inert inside a preview card.
const stubRouter = {
  back: noop,
  forward: noop,
  refresh: noop,
  push: noop,
  replace: noop,
  prefetch: noop,
} as never

export function DsProvider({ children }: { children: React.ReactNode }) {
  const searchParams = React.useMemo(() => new URLSearchParams(), [])

  return (
    <AppRouterContext.Provider value={stubRouter}>
      <PathnameContext.Provider value="/">
        <SearchParamsContext.Provider value={searchParams}>
          <PathParamsContext.Provider value={{}}>
            <NextIntlClientProvider
              locale="en"
              messages={messages}
              timeZone="Europe/Brussels"
            >
              {children}
            </NextIntlClientProvider>
          </PathParamsContext.Provider>
        </SearchParamsContext.Provider>
      </PathnameContext.Provider>
    </AppRouterContext.Provider>
  )
}
