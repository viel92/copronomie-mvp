'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-pill font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-landing-black !text-white hover:bg-landing-black/90 shadow-sm',
        secondary: 'bg-white !text-landing-black border-2 border-landing-black hover:bg-landing-gray-dark',
        outline: 'border-2 border-landing-black !text-landing-black hover:bg-landing-black hover:!text-white',
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const MotionComp = motion(Comp)

    return (
      <MotionComp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2, ease: 'easeOut' }
        }}
        whileTap={{
          scale: 0.98,
          transition: { duration: 0.1 }
        }}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
