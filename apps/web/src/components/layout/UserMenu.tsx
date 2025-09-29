'use client'

import { useRouter } from 'next/navigation'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@copronomie/ui'
import { User, Settings, LogOut, CreditCard } from 'lucide-react'
import { trpc } from '@/lib/trpc'

interface UserMenuProps {
  userName?: string
  userEmail?: string
}

export function UserMenu({ userName, userEmail }: UserMenuProps) {
  const router = useRouter()
  const utils = trpc.useUtils()
  const logoutMutation = trpc.auth.logout.useMutation()

  const handleLogout = async () => {
    try {
      // Nettoyer TOUT le localStorage immédiatement (ancien et nouveau système)
      if (typeof window !== 'undefined') {
        // Nouveau système
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        // Ancien système AuthProvider
        localStorage.removeItem('copronomie_user')
        localStorage.removeItem('copronomie_session')
      }

      // Invalider tous les caches tRPC
      utils.invalidate()

      // Appeler la mutation de déconnexion (sans attendre)
      logoutMutation.mutate()

      // Forcer un rechargement complet vers /auth
      window.location.href = '/auth'
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)

      // En cas d'erreur, forcer quand même la déconnexion
      if (typeof window !== 'undefined') {
        localStorage.clear()
      }
      window.location.href = '/auth'
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const displayName = userName || userEmail?.split('@')[0] || 'Utilisateur'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg hover:bg-muted px-2 py-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={undefined} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline text-sm font-medium">{displayName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            {userEmail && (
              <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/syndic/account')}>
          <User className="mr-2 h-4 w-4" />
          <span>Mon profil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/syndic/account')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/syndic/subscription')}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Abonnement</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}