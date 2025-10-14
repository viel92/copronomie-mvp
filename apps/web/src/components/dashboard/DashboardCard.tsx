import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function DashboardCard({ children, className, hover = false }: DashboardCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-card p-6 border border-landing-border shadow-card transition-all',
        hover && 'hover:shadow-card-hover cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

interface DashboardCardHeaderProps {
  children: ReactNode
  className?: string
}

export function DashboardCardHeader({ children, className }: DashboardCardHeaderProps) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

interface DashboardCardTitleProps {
  children: ReactNode
  className?: string
}

export function DashboardCardTitle({ children, className }: DashboardCardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-landing-primary', className)}>
      {children}
    </h3>
  )
}

interface DashboardCardContentProps {
  children: ReactNode
  className?: string
}

export function DashboardCardContent({ children, className }: DashboardCardContentProps) {
  return <div className={className}>{children}</div>
}
