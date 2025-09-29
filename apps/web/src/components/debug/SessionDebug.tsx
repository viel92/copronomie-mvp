'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { useEffect, useState } from 'react'

export function SessionDebug() {
  const { session, user, isAuthenticated, checkSessionExpiry, logout } = useAuth()
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    if (!session?.expires_at) return

    const interval = setInterval(() => {
      const now = Date.now()
      const expiryTime = session.expires_at * 1000
      const timeDiff = expiryTime - now

      if (timeDiff <= 0) {
        setTimeLeft('EXPIRÉ')
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60))
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [session])

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs font-mono max-w-xs">
      <div className="font-bold mb-2">🔐 Debug Session</div>
      <div>User: {user?.email || 'Non connecté'}</div>
      <div>Statut: {isAuthenticated ? '✅ Connecté' : '❌ Déconnecté'}</div>
      <div>Expiration: {timeLeft || 'Aucune'}</div>
      <div>Token: {session?.access_token?.substring(0, 10)}...</div>
      <div className="mt-2 space-x-2">
        <button
          onClick={() => logout()}
          className="bg-red-600 px-2 py-1 rounded text-xs"
        >
          Logout
        </button>
        <button
          onClick={() => {
            console.log('Session expired:', checkSessionExpiry())
            console.log('Full session:', session)
          }}
          className="bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Debug
        </button>
      </div>
    </div>
  )
}