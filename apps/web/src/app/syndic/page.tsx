'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SyndicPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirection automatique vers le dashboard
    router.replace('/syndic/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirection en cours...</p>
    </div>
  )
}