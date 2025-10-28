import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TRPCProvider } from '@/components/providers/TRPCProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata: Metadata = {
  title: {
    default: 'Copronomie - La plateforme qui simplifie les travaux de copropriété',
    template: '%s | Copronomie'
  },
  description: 'Simplifiez la gestion de vos travaux de copropriété. Publiez vos projets, recevez des devis qualifiés d\'artisans vérifiés et choisissez la meilleure offre en quelques clics.',
  keywords: ['copropriété', 'syndic', 'travaux', 'devis', 'artisans', 'gestion', 'rénovation', 'chantier'],
  authors: [{ name: 'Copronomie' }],
  creator: 'Copronomie',
  publisher: 'Copronomie',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    siteName: 'Copronomie',
    title: 'Copronomie - La plateforme qui simplifie les travaux de copropriété',
    description: 'Simplifiez la gestion de vos travaux de copropriété. Publiez vos projets, recevez des devis qualifiés et choisissez la meilleure offre en quelques clics.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Copronomie - Plateforme de gestion de travaux de copropriété'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Copronomie - La plateforme qui simplifie les travaux de copropriété',
    description: 'Simplifiez la gestion de vos travaux de copropriété avec Copronomie',
    images: ['/og-image.png'],
    creator: '@copronomie'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'verification_token',
    yandex: 'verification_token'
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F6F7' },
    { media: '(prefers-color-scheme: dark)', color: '#1B0C25' }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Copronomie'
  },
  formatDetection: {
    telephone: false
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-inter antialiased`} style={{ fontFamily: "'General Sans', var(--font-inter), sans-serif" }}>
        <AuthProvider>
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </AuthProvider>
      </body>
    </html>
  )
}