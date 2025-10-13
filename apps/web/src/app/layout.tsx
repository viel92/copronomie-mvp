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
  title: 'Copronomie V2 - Gestion de Copropriétés',
  description: 'Plateforme SaaS pour la gestion de copropriétés - Syndics, Entreprises et Copropriétaires',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-inter antialiased`}>
        <AuthProvider>
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </AuthProvider>
      </body>
    </html>
  )
}