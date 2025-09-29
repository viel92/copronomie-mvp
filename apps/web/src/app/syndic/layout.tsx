'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { SyndicSidebar } from '@/components/layout/SyndicSidebar'
import { trpc } from '@/lib/trpc'

export default function SyndicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)
  const { data: user, isLoading, error } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    if (!isLoading && (!user || error) && !hasRedirected) {
      setHasRedirected(true)
      router.replace('/auth')
    }
  }, [user, isLoading, error, router, hasRedirected])

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Si pas d'utilisateur, ne rien afficher (redirection en cours)
  if (!user || error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout
      sidebar={<SyndicSidebar />}
      userType="syndic"
      userName={user?.user?.user_metadata?.firstName || user?.user?.user_metadata?.lastName || undefined}
      userEmail={user?.user?.email || undefined}
    >
      {children}
    </DashboardLayout>
  )
}