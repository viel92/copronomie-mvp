'use client'

import { ReactNode } from 'react'
import { Building2, Search } from 'lucide-react'
import { Button, Badge } from '@copronomie/ui'
import { UserMenu } from './UserMenu'
import { NotificationsDropdown } from './NotificationsDropdown'

interface DashboardLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  userType: "syndic" | "company" | "condo"
  userName?: string
  userEmail?: string
}

export function DashboardLayout({ children, sidebar, userType, userName, userEmail }: DashboardLayoutProps) {
  const getUserTypeLabel = () => {
    switch (userType) {
      case "syndic": return "Syndic Pro"
      case "company": return "Entreprise BTP"
      case "condo": return "Copropriété"
      default: return ""
    }
  }

  const getUserTypeColor = () => {
    switch (userType) {
      case "syndic": return "bg-primary text-primary-foreground"
      case "company": return "bg-secondary text-secondary-foreground"
      case "condo": return "bg-green-600 text-white"
      default: return "bg-primary text-primary-foreground"
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-md border-b border-border shadow-sm z-50">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-foreground">Copronomie</span>
              <Badge className={getUserTypeColor()}>
                {getUserTypeLabel()}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <Button variant="ghost" size="sm" className="hidden md:flex gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline text-muted-foreground">Rechercher...</span>
              <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            {/* Notifications */}
            <NotificationsDropdown />

            {/* User Menu */}
            <UserMenu userName={userName} userEmail={userEmail} />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {sidebar}

      {/* Main Content */}
      <main className="flex-1 ml-64 pt-16">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}