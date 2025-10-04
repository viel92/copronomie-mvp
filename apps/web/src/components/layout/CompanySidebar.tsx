'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Settings,
  Home,
  ClipboardList
} from 'lucide-react'

const navigationItems = [
  {
    title: "Vue d'ensemble",
    url: "/company/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projets disponibles",
    url: "/company/projects",
    icon: FolderKanban,
  },
  {
    title: "Mes devis",
    url: "/company/quotes",
    icon: FileText,
  },
  {
    title: "Mes contrats",
    url: "/company/contracts",
    icon: ClipboardList,
  },
]

const accountActions = [
  {
    title: "Mon compte",
    url: "/company/account",
    icon: Settings,
  },
  {
    title: "Profil entreprise",
    url: "/company/profile",
    icon: Settings,
  },
]

export function CompanySidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/company/dashboard") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  const getNavClasses = (path: string) => {
    return cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-muted",
      isActive(path)
        ? "bg-primary text-primary-foreground hover:bg-primary/90"
        : "text-muted-foreground hover:text-foreground"
    )
  }

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-card p-4 overflow-y-auto">
      {/* Navigation principale */}
      <div className="space-y-2">
        <h2 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Navigation
        </h2>
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className={getNavClasses(item.url)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Compte */}
      <div className="mt-8 space-y-2">
        <h2 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Compte
        </h2>
        <nav className="space-y-1">
          {accountActions.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className={getNavClasses(item.url)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Accueil */}
      <div className="mt-auto pt-8">
        <nav>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span>Accueil</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
