'use client'

import { trpc } from '@/lib/trpc'
import { useAuth } from '@/components/providers/AuthProvider'
import { useState, useEffect } from 'react'

export default function TestAuthPage() {
  const { user: authUser, session, isLoading: authLoading, isAuthenticated, login, logout } = useAuth()
  const [loginForm, setLoginForm] = useState({ email: 'test@syndic.com', password: 'password123' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [localStorageData, setLocalStorageData] = useState<{[key: string]: string | null}>({})
  const [isClient, setIsClient] = useState(false)

  const { data: debugData, isLoading: debugLoading, error: debugError } = trpc.auth.debug.useQuery()
  const { data: user, isLoading, error } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    enabled: isAuthenticated
  })

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      setLocalStorageData({
        'copronomie_auth': localStorage.getItem('copronomie_auth'),
        'sb-localhost-auth-token': localStorage.getItem('sb-localhost-auth-token')
      })
    }
  }, [])

  const handleLogin = async () => {
    setLoginLoading(true)
    setLoginError(null)
    try {
      const result = await login(loginForm.email, loginForm.password)
      if (!result.success) {
        setLoginError(result.error || 'Erreur de connexion')
      }
    } catch (error: any) {
      setLoginError(error.message || 'Erreur inattendue')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    setLoginError(null)
  }

  if (authLoading || debugLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Test d'authentification robuste</h1>

      {/* Section AuthProvider */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '2px solid #4CAF50', borderRadius: '8px' }}>
        <h2>🔐 AuthProvider Status</h2>
        <ul>
          <li>Authentifié : {isAuthenticated ? '✅' : '❌'}</li>
          <li>Utilisateur : {authUser ? '✅' : '❌'}</li>
          <li>Session : {session ? '✅' : '❌'}</li>
          <li>Token expiré : {session && session.expires_at < Date.now() ? '⚠️' : '✅'}</li>
        </ul>

        {authUser && (
          <div>
            <h3>Utilisateur connecté :</h3>
            <pre style={{ background: '#e8f5e8', padding: '10px', border: '1px solid #4CAF50' }}>
              {JSON.stringify(authUser, null, 2)}
            </pre>
          </div>
        )}

        {session && (
          <div>
            <h3>Session :</h3>
            <pre style={{ background: '#e8f5e8', padding: '10px', border: '1px solid #4CAF50' }}>
              {JSON.stringify({
                expires_at: new Date(session.expires_at).toISOString(),
                expires_in: Math.round((session.expires_at - Date.now()) / 1000 / 60) + ' minutes',
                has_refresh_token: !!session.refresh_token
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Section Login/Logout */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '2px solid #2196F3', borderRadius: '8px' }}>
        <h2>🔑 Test de connexion</h2>

        {!isAuthenticated ? (
          <div>
            <div style={{ marginBottom: '10px' }}>
              <label>Email: </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Password: </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                style={{ marginLeft: '10px', padding: '5px' }}
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loginLoading}
              style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              {loginLoading ? 'Connexion...' : 'Se connecter'}
            </button>
            {loginError && (
              <div style={{ color: 'red', marginTop: '10px' }}>
                Erreur: {loginError}
              </div>
            )}
          </div>
        ) : (
          <div>
            <p>✅ Connecté en tant que: {authUser?.email}</p>
            <button
              onClick={handleLogout}
              style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>

      {/* Section tRPC Tests */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '2px solid #FF9800', borderRadius: '8px' }}>
        <h2>📡 Tests tRPC</h2>

        <h3>Debug endpoint (public):</h3>
        {debugError ? (
          <pre style={{ background: '#ffebee', padding: '10px', border: '1px solid #f44336', color: 'red' }}>
            {JSON.stringify(debugError, null, 2)}
          </pre>
        ) : (
          <pre style={{ background: '#fff3e0', padding: '10px', border: '1px solid #FF9800' }}>
            {JSON.stringify(debugData, null, 2)}
          </pre>
        )}

        <h3>Me endpoint (protected):</h3>
        {error ? (
          <pre style={{ background: '#ffebee', padding: '10px', border: '1px solid #f44336', color: 'red' }}>
            {JSON.stringify(error, null, 2)}
          </pre>
        ) : user ? (
          <pre style={{ background: '#e8f5e8', padding: '10px', border: '1px solid #4CAF50' }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <p>Pas de données utilisateur (normal si non connecté)</p>
        )}
      </div>

      {/* Section LocalStorage */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '2px solid #9C27B0', borderRadius: '8px' }}>
        <h2>💾 LocalStorage Status</h2>
        {isClient ? (
          <ul>
            <li>copronomie_auth : {localStorageData['copronomie_auth'] ? '✅' : '❌'}</li>
            <li>sb-localhost-auth-token : {localStorageData['sb-localhost-auth-token'] ? '✅' : '❌'}</li>
          </ul>
        ) : (
          <p>Chargement des données localStorage...</p>
        )}

        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              console.log('LocalStorage contents:');
              console.log('copronomie_auth:', localStorage.getItem('copronomie_auth'));
              console.log('sb-localhost-auth-token:', localStorage.getItem('sb-localhost-auth-token'));
            }
          }}
          style={{ padding: '8px 16px', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Log LocalStorage to Console
        </button>
      </div>
    </div>
  )
}