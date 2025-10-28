'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  email: string
  role: string
  full_name?: string
  created_at?: string
  user_metadata?: {
    full_name?: string
    company_name?: string
    [key: string]: any
  }
}

interface AuthSession {
  access_token: string
  refresh_token: string
  expires_at: number
}

interface LoginResult {
  success: boolean
  error?: string
  user: User | null
}

interface AuthContextType {
  user: User | null
  session: AuthSession | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<LoginResult>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  checkSessionExpiry: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(typeof window === 'undefined' ? false : true)

  // Clés de stockage sécurisées
  const USER_STORAGE_KEY = 'copronomie_user'
  const SESSION_STORAGE_KEY = 'copronomie_session'

  // Configuration des sessions (durées en millisecondes)
  // Pour le test: 2 minutes au lieu de 2 heures
  const SESSION_DURATION = process.env.NODE_ENV === 'development'
    ? 2 * 60 * 1000 // 2 minutes en dev pour tester
    : 2 * 60 * 60 * 1000 // 2 heures en production
  const REFRESH_THRESHOLD = 30 * 1000 // Refresh 30s avant expiration en dev
  const SESSION_CHECK_INTERVAL = 5 * 1000 // Vérifier toutes les 5 secondes en dev

  // Vérifier si la session est expirée
  const checkSessionExpiry = useCallback(() => {
    if (!session?.expires_at) return false
    const now = Date.now()
    const expiryTime = session.expires_at * 1000 // Convertir en millisecondes
    return now >= expiryTime
  }, [session])

  // Vérifier si on doit refresh la session
  const shouldRefreshSession = useCallback(() => {
    if (!session?.expires_at) return false
    const now = Date.now()
    const expiryTime = session.expires_at * 1000
    return (expiryTime - now) <= REFRESH_THRESHOLD
  }, [session])

  // Charger la session depuis localStorage au démarrage
  const loadStoredSession = useCallback(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY)
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY)

      if (storedUser && storedSession) {
        const userData = JSON.parse(storedUser)
        const sessionData = JSON.parse(storedSession)

        // Vérifier si la session stockée est encore valide
        const now = Date.now()
        const expiryTime = sessionData.expires_at * 1000

        if (now < expiryTime) {
          setUser(userData)
          setSession(sessionData)
        } else {
          // Session expirée, nettoyer le stockage
          clearStoredSession()
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la session:', error)
      clearStoredSession()
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Sauvegarder la session dans localStorage
  const saveSession = useCallback((userData: User, sessionData: AuthSession) => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData))
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData))
      setUser(userData)
      setSession(sessionData)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la session:', error)
    }
  }, [])

  // Nettoyer la session stockée
  const clearStoredSession = useCallback(() => {
    if (typeof window === 'undefined') return

    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setUser(null)
    setSession(null)
  }, [])

  // Fonction de login
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Appel Supabase direct via SDK
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Login API error:', errorData)
        throw new Error(errorData.error || errorData.message || 'Erreur de connexion')
      }

      const result = await response.json()
      console.log('Login API response:', result)

      if (!result.user || !result.session) {
        throw new Error('Réponse invalide du serveur')
      }

      // Sauvegarder la vraie session
      const user: User = {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role || 'condo'
      }

      const session: AuthSession = {
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token,
        expires_at: result.session.expires_at
      }

      saveSession(user, session)
      return { success: true, user }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'Erreur de connexion', user: null }
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de logout
  const logout = async () => {
    setIsLoading(true)
    try {
      // TODO: Appel API pour invalider la session côté serveur
      clearStoredSession()
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction de refresh de session
  const refreshSession = async () => {
    if (!session?.refresh_token) return

    try {
      // TODO: Appel API réel pour refresh
      const newExpiryTime = Math.floor((Date.now() + SESSION_DURATION) / 1000)
      const updatedSession = {
        ...session,
        expires_at: newExpiryTime
      }

      if (user) {
        saveSession(user, updatedSession)
      }
    } catch (error) {
      console.error('Erreur lors du refresh de la session:', error)
      await logout()
    }
  }

  // Effect pour charger la session au démarrage
  useEffect(() => {
    loadStoredSession()
  }, [loadStoredSession])

  // Effect pour vérifier l'expiration et auto-refresh
  useEffect(() => {
    if (!session || !user) return

    const interval = setInterval(() => {
      if (checkSessionExpiry()) {
        console.log('Session expirée - déconnexion automatique')
        logout()
      } else if (shouldRefreshSession()) {
        console.log('Refresh automatique de la session')
        refreshSession()
      }
    }, SESSION_CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [session, user, checkSessionExpiry, shouldRefreshSession])

  // Effect pour nettoyer au changement de page/fermeture
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Optionnel: nettoyer les sessions très anciennes
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session) {
        // Re-vérifier la session quand l'utilisateur revient sur l'onglet
        if (checkSessionExpiry()) {
          logout()
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [session, checkSessionExpiry])

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session && !checkSessionExpiry(),
    login,
    logout,
    refreshSession,
    checkSessionExpiry,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}