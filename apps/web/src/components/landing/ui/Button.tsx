'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'group relative inline-flex items-center justify-center rounded-lg font-medium overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-landing-black text-white hover:bg-landing-black/90',
        secondary: 'bg-landing-gray-dark text-landing-black hover:bg-landing-gray',
        outline: 'border-2 border-landing-black text-landing-black hover:bg-landing-black hover:text-white',
      },
      size: {
        sm: 'px-6 py-3 text-body-14',
        md: 'px-8 py-4 text-body-16',
        lg: 'px-10 py-5 text-body-18',
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {/* Dual-text container for vertical slide animation */}
        <span className="relative flex flex-col h-full items-center justify-center">
          {/* Primary text - slides up on hover */}
          <span className="transition-transform duration-300 ease-out group-hover:-translate-y-full">
            {children}
          </span>
          {/* Duplicate text - slides in from below on hover */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0">
            {children}
          </span>
        </span>
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
