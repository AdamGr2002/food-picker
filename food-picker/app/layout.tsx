import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'

const ClerkProviderWithChildren = dynamic(() => import('./components/ClerkProviderWithChildren'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Food Picker',
  description: 'An app to help you decide what to eat',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProviderWithChildren>{children}</ClerkProviderWithChildren>
      </body>
    </html>
  )
}