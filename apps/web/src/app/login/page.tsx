'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Container } from '@/components/landing/ui'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      const redirectPath = user.role === 'company' ? '/company/dashboard' : '/syndic/dashboard'
      router.push(redirectPath)
    }
  }, [isAuthenticated, user, authLoading, router])

  // Afficher un loader pendant la vérification de session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-landing-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-landing-primary mx-auto mb-4"></div>
          <p className="text-landing-primary/70">Vérification de la session...</p>
        </div>
      </div>
    )
  }

  // Si connecté, afficher un message pendant la redirection
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-landing-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-landing-primary mx-auto mb-4"></div>
          <p className="text-landing-primary/70">Redirection vers votre espace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-landing-white">
      <Container>
        <div className="min-h-screen flex items-center justify-center py-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-landing-primary/70 hover:text-landing-primary transition-colors mb-8 group"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Retour à l'accueil
            </Link>

            {/* Card */}
            <div className="bg-white rounded-card shadow-card-lift p-8 md:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-block mb-4 px-4 py-2 bg-landing-blue-lite rounded-pill text-sm font-medium text-landing-black">
                  Connexion
                </div>
                <h1 className="text-4xl font-bold text-landing-primary mb-2">
                  Bon retour !
                </h1>
                <p className="text-landing-primary/70">
                  Connectez-vous pour accéder à votre espace
                </p>
              </div>

              {/* Form */}
              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError(null)
                  setLoading(true)

                  const formData = new FormData(e.currentTarget)
                  const email = formData.get('email') as string
                  const password = formData.get('password') as string

                  try {
                    const result = await login(email, password)
                    if (result.success) {
                      const userRole = result.user?.role || 'syndic'
                      const dashboardPath = userRole === 'company' ? '/company/dashboard' : '/syndic/dashboard'
                      router.push(dashboardPath)
                    } else {
                      setError(result.error || 'Erreur de connexion')
                    }
                  } catch (err: any) {
                    setError(err.message || 'Une erreur est survenue')
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-landing-primary">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-landing-primary/40" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="votre@email.com"
                      className="block w-full pl-12 pr-4 py-3 bg-landing-gray-dark border-0 rounded-medium text-landing-primary placeholder:text-landing-primary/40 focus:ring-2 focus:ring-landing-blue transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-landing-primary">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-landing-primary/40" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="block w-full pl-12 pr-4 py-3 bg-landing-gray-dark border-0 rounded-medium text-landing-primary placeholder:text-landing-primary/40 focus:ring-2 focus:ring-landing-blue transition-all"
                    />
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex items-center justify-end">
                  <a href="#" className="text-sm text-landing-blue hover:text-landing-primary transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-medium text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-landing-primary text-white rounded-pill font-medium hover:bg-landing-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-card hover:shadow-card-hover"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-landing-primary/70">
                  Pas encore de compte ?{' '}
                  <Link href="/register" className="text-landing-blue font-medium hover:text-landing-primary transition-colors">
                    S'inscrire
                  </Link>
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <p className="mt-6 text-center text-sm text-landing-primary/60">
              Vos données sont sécurisées et chiffrées
            </p>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
