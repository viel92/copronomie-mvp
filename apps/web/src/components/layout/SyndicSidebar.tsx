'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FolderKanban,
  Building,
  Users,
  BarChart3,
  Settings,
  Plus,
  Home,
  ClipboardList,
  FileText,
  Zap
} from 'lucide-react'

const navigationItems = [
  {
    title: "Vue d'ensemble",
    url: "/syndic/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projets de Travaux",
    url: "/syndic/projects",
    icon: FolderKanban,
  },
  {
    title: "Ordres de Service",
    url: "/syndic/service-orders",
    icon: ClipboardList,
  },
  {
    title: "Contrats Copropriété",
    url: "/syndic/property-contracts",
    icon: FileText,
  },
  {
    title: "Contrats d'Énergie",
    url: "/syndic/energy-contracts",
    icon: Zap,
  },
  {
    title: "Copropriétés",
    url: "/syndic/condos",
    icon: Building,
  },
  {
    title: "Entreprises",
    url: "/syndic/companies",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/syndic/analytics",
    icon: BarChart3,
  },
]

const quickActions = [
  {
    title: "Nouveau projet",
    url: "/syndic/projects/new",
    icon: Plus,
  },
  {
    title: "Ajouter copropriété",
    url: "/syndic/condos/new",
    icon: Building,
  },
]

const accountActions = [
  {
    title: "Mon compte",
    url: "/syndic/account",
    icon: Settings,
  },
  {
    title: "Abonnement",
    url: "/syndic/subscription",
    icon: Settings,
  },
  {
    title: "Affiliation",
    url: "/syndic/referral",
    icon: Users,
  },
]

export function SyndicSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/syndic/dashboard") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  const getNavClasses = (path: string) => {
    return cn(
      "flex items-center gap-3 px-3 py-2 rounded-medium text-sm font-medium transition-all",
      isActive(path)
        ? "bg-landing-primary text-white hover:bg-landing-primary/90 shadow-card"
        : "text-landing-primary/70 hover:bg-landing-gray-dark hover:text-landing-primary"
    )
  }

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-landing-border bg-white p-4 overflow-y-auto">
      {/* Navigation principale */}
      <div className="space-y-2">
        <h2 className="mb-2 px-3 text-xs font-semibold text-landing-primary/50 uppercase tracking-wide">
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

      {/* Actions rapides */}
      <div className="mt-8 space-y-2">
        <h2 className="mb-2 px-3 text-xs font-semibold text-landing-primary/50 uppercase tracking-wide">
          Actions rapides
        </h2>
        <nav className="space-y-1">
          {quickActions.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className="flex items-center gap-3 px-3 py-2 rounded-medium text-sm font-medium transition-all text-landing-primary/70 hover:bg-landing-gray-dark hover:text-landing-primary"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Compte */}
      <div className="mt-8 space-y-2">
        <h2 className="mb-2 px-3 text-xs font-semibold text-landing-primary/50 uppercase tracking-wide">
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
            className="flex items-center gap-3 px-3 py-2 rounded-medium text-sm font-medium transition-all text-landing-primary/70 hover:bg-landing-gray-dark hover:text-landing-primary"
          >
            <Home className="h-4 w-4" />
            <span>Accueil</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}