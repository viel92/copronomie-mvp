'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Mail, Lock, User, Building2 } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Container } from '@/components/landing/ui'
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator'

export default function RegisterPage() {
  const router = useRouter()
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth()
  const [userType, setUserType] = useState<'syndic' | 'company'>('syndic')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState('')

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
                <div className="inline-block mb-4 px-4 py-2 bg-landing-purple-lite rounded-pill text-sm font-medium text-landing-black">
                  Inscription
                </div>
                <h1 className="text-4xl font-bold text-landing-primary mb-2">
                  Créer un compte
                </h1>
                <p className="text-landing-primary/70">
                  Rejoignez la plateforme Copronomie
                </p>
              </div>

              {/* User Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-landing-primary mb-3">
                  Type de compte
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('syndic')}
                    className={`p-4 rounded-medium border-2 transition-all ${
                      userType === 'syndic'
                        ? 'border-landing-blue bg-landing-blue-lite'
                        : 'border-landing-gray-dark hover:border-landing-blue/50'
                    }`}
                  >
                    <User className={`h-6 w-6 mx-auto mb-2 ${userType === 'syndic' ? 'text-landing-blue' : 'text-landing-primary/40'}`} />
                    <div className={`text-sm font-medium ${userType === 'syndic' ? 'text-landing-primary' : 'text-landing-primary/70'}`}>
                      Syndic
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('company')}
                    className={`p-4 rounded-medium border-2 transition-all ${
                      userType === 'company'
                        ? 'border-landing-purple bg-landing-purple-lite'
                        : 'border-landing-gray-dark hover:border-landing-purple/50'
                    }`}
                  >
                    <Building2 className={`h-6 w-6 mx-auto mb-2 ${userType === 'company' ? 'text-landing-purple' : 'text-landing-primary/40'}`} />
                    <div className={`text-sm font-medium ${userType === 'company' ? 'text-landing-primary' : 'text-landing-primary/70'}`}>
                      Entreprise
                    </div>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError(null)
                  setLoading(true)

                  const formData = new FormData(e.currentTarget)
                  const name = formData.get('name') as string
                  const companyName = formData.get('companyName') as string
                  const email = formData.get('email') as string
                  const password = formData.get('password') as string
                  const confirmPassword = formData.get('confirmPassword') as string

                  if (!name) {
                    setError('Le nom complet est requis')
                    setLoading(false)
                    return
                  }

                  if (!companyName) {
                    setError(userType === 'syndic' ? 'Le nom du syndic est requis' : 'Le nom de l\'entreprise est requis')
                    setLoading(false)
                    return
                  }

                  if (password !== confirmPassword) {
                    setError('Les mots de passe ne correspondent pas')
                    setLoading(false)
                    return
                  }

                  const registerData = {
                    email,
                    password,
                    confirmPassword: password,
                    role: userType,
                    firstName: name.split(' ')[0],
                    lastName: name.split(' ').slice(1).join(' ') || name.split(' ')[0],
                    companyName: companyName,
                  }

                  try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
                    const result = await fetch(`${apiUrl}/api/auth/register`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(registerData),
                    })

                    const data = await result.json()

                    if (result.ok && data.success) {
                      // Connexion automatique après inscription
                      const loginResult = await login(email, password)
                      if (loginResult.success) {
                        const dashboardPath = userType === 'company' ? '/company/dashboard' : '/syndic/dashboard'
                        router.push(dashboardPath)
                      }
                    } else {
                      setError(data.message || 'Erreur lors de l\'inscription')
                    }
                  } catch (err: any) {
                    setError(err.message || 'Une erreur est survenue')
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-landing-primary">
                    Nom complet
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-landing-primary/40" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Votre nom complet"
                      className="block w-full pl-12 pr-4 py-3 bg-landing-gray-dark border-0 rounded-medium text-landing-primary placeholder:text-landing-primary/40 focus:ring-2 focus:ring-landing-blue transition-all"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <label htmlFor="companyName" className="block text-sm font-medium text-landing-primary">
                    {userType === 'syndic' ? 'Nom du syndic' : 'Nom de l\'entreprise'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-landing-primary/40" />
                    </div>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      placeholder={userType === 'syndic' ? 'Ex: Syndic des Jardins' : 'Ex: Bâtiment Pro SARL'}
                      className="block w-full pl-12 pr-4 py-3 bg-landing-gray-dark border-0 rounded-medium text-landing-primary placeholder:text-landing-primary/40 focus:ring-2 focus:ring-landing-blue transition-all"
                    />
                  </div>
                </div>

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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 bg-landing-gray-dark border-0 rounded-medium text-landing-primary placeholder:text-landing-primary/40 focus:ring-2 focus:ring-landing-blue transition-all"
                    />
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <PasswordStrengthIndicator password={password} />
                )}

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-landing-primary">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-landing-primary/40" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="block w-full pl-12 pr-4 py-3 bg-landing-gray-dark border-0 rounded-medium text-landing-primary placeholder:text-landing-primary/40 focus:ring-2 focus:ring-landing-blue transition-all"
                    />
                  </div>
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
                  {loading ? 'Inscription...' : 'Créer mon compte'}
                </button>
              </form>

              {/* Terms */}
              <p className="mt-6 text-xs text-center text-landing-primary/60">
                En créant un compte, vous acceptez les{' '}
                <Link href="/cgu" className="text-landing-blue hover:underline">
                  conditions d'utilisation
                </Link>{' '}
                et la{' '}
                <Link href="/privacy-policy" className="text-landing-blue hover:underline">
                  politique de confidentialité
                </Link>
                .
              </p>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-landing-primary/70">
                  Déjà un compte ?{' '}
                  <Link href="/login" className="text-landing-blue font-medium hover:text-landing-primary transition-colors">
                    Se connecter
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
