import type { Metadata } from 'next'
import { Jost, Lora, DM_Sans } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { LocaleProvider, type Locale } from '@/contexts/LocaleContext'

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  display: 'swap',
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Shinji No Sekai | Audio Engineer',
  description: 'Modern audio engineering and production services.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const rawLocale = cookieStore.get('locale')?.value
  const initialLocale: Locale = rawLocale === 'fr' ? 'fr' : 'en'

  return (
    <html lang={initialLocale}>
      <body
        className={`${jost.variable} ${lora.variable} ${dmSans.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <LocaleProvider initialLocale={initialLocale}>
          <AuthProvider>
            <Navbar />
            <main className="grow" suppressHydrationWarning>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
