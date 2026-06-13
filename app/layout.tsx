import { Analytics } from '@vercel/analytics/next' // Importing Analytics component from Vercel for tracking user interactions and analytics in the application
import type { Metadata } from 'next' // Importing Metadata type from Next.js for defining metadata for the application such as title, description, and icons
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css' // Importing global CSS styles for the application
import { Providers } from './providers'

// Load Geist Sans and Geist Mono fonts from Google Fonts with specified subsets and CSS variables for use throughout the application
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Metadata for the application including title, description, generator, and icons for different themes and platforms
export const metadata: Metadata = {
  title: 'Electracore Smart Transformer Monitoring System',
  description: 'AI-Powered Smart Transformer Monitoring and Protection System',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
