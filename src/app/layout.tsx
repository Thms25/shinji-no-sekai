import type { Metadata } from 'next'
import { Jost, Lora, DM_Sans } from 'next/font/google'
import { cookies } from 'next/headers'
import './globals.css'

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
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value ?? 'fr'

  return (
    <html lang={locale}>
      <body
        className={`${jost.variable} ${lora.variable} ${dmSans.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  )
}
