import type { Metadata } from 'next'

import React from 'react'

import { Providers } from '@/providers'
import { draftMode } from 'next/headers'

import { Sidebar } from '@/components/portfolio/Sidebar'
import { ContactModal } from '@/components/portfolio/ContactModal'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export const metadata: Metadata = {
  title: 'four.one.nine | Portfolio',
  description: 'Creative developer & designer portfolio',
  metadataBase: new URL(getServerSideURL()),
  openGraph: {
    title: 'four.one.nine | Portfolio',
    description: 'Creative developer & designer portfolio',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Doto:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body style={{ backgroundColor: '#DDD92A', color: '#373737' }}>
        <Providers>
          <div className="flex flex-col lg:flex-row min-h-screen">
            <aside className="w-full lg:w-1/4 lg:sticky lg:top-0 lg:h-screen overflow-y-auto border-b lg:border-b-0 lg:border-r" style={{ backgroundColor: '#DDD92A', color: '#373737', borderColor: 'rgba(55, 55, 55, 0.5)' }}>
              <Sidebar />
            </aside>

            <main className="w-full lg:w-3/4" style={{ backgroundColor: '#DDD92A' }}>
              {children}
            </main>
          </div>

          <ContactModal />
        </Providers>
      </body>
    </html>
  )
}
