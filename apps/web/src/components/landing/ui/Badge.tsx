import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2',
          'backdrop-blur-md bg-white/20 border border-white/30 rounded-pill shadow-glass',
          'text-sm font-medium',
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
    )
  }
)
Badge.displayName = 'Badge'

export { Badge }
