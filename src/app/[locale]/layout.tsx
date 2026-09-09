import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  await params
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <SmoothScrollProvider>
          <Navbar />
          <main className="grow" suppressHydrationWarning>
            {children}
          </main>
          <Footer />
        </SmoothScrollProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  )
}
