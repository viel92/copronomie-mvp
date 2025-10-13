import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glass?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, glass = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-8',
          glass && 'backdrop-blur-md bg-white/10 border border-landing-overlay-strong shadow-glass',
          !glass && 'bg-white border border-gray-100 shadow-card',
          hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

export { Card }
