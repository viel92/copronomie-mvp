'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { Navigation } from '@/components/landing/navigation'
import { Footer } from '@/components/landing/footer'

export default function LegalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <>
      <Navigation />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <Footer />
    </>
  )
}
