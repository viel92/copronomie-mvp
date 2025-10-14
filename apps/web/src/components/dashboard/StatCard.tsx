import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color?: 'blue' | 'purple' | 'orange' | 'pink' | 'primary'
  subtitle?: string
}

const colorStyles = {
  blue: {
    bg: 'bg-landing-blue-lite',
    icon: 'text-landing-blue',
    border: 'border-landing-blue/20',
  },
  purple: {
    bg: 'bg-landing-purple-lite',
    icon: 'text-landing-purple',
    border: 'border-landing-purple/20',
  },
  orange: {
    bg: 'bg-landing-orange-lite',
    icon: 'text-landing-orange',
    border: 'border-landing-orange/20',
  },
  pink: {
    bg: 'bg-landing-pink-lite',
    icon: 'text-landing-pink',
    border: 'border-landing-pink/20',
  },
  primary: {
    bg: 'bg-landing-gray-dark',
    icon: 'text-landing-primary',
    border: 'border-landing-primary/20',
  },
}

export function StatCard({ title, value, icon: Icon, color = 'primary', subtitle }: StatCardProps) {
  const styles = colorStyles[color]

  return (
    <div className="bg-white rounded-card p-6 border border-landing-border shadow-card hover:shadow-card-hover transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-landing-primary/60 mb-1">{title}</p>
          <p className="text-3xl font-bold text-landing-primary">{value}</p>
          {subtitle && (
            <p className="text-xs text-landing-primary/50 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn('p-3 rounded-medium', styles.bg)}>
          <Icon className={cn('h-6 w-6', styles.icon)} />
        </div>
      </div>
    </div>
  )
}
