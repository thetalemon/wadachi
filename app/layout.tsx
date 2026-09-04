import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'
import { Suspense } from 'react'
import Link from 'next/link'
import { DeployButton } from '@/components/deploy-button'
import { AuthButton } from '@/components/auth-button'
import { ThemeSwitcher } from '@/components/theme-switcher'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase'
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  display: 'swap',
  subsets: ['latin']
})

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__NEXT_PUBLIC_SUPABASE_URL = ${JSON.stringify(
              process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
            )}; window.__NEXT_PUBLIC_SUPABASE_KEY = ${JSON.stringify(
              process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
                ''
            )};`
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                  <Link href={'/'}>Wadachi</Link>
                  <div className="flex items-center gap-2">
                    <DeployButton />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Suspense>
                    <AuthButton />
                  </Suspense>
                  <ThemeSwitcher />
                </div>
              </div>
            </nav>

            <main className="flex-1">{children}</main>

            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
              <ThemeSwitcher />
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
