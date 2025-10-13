'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Card } from '../ui'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  index: number
}

export function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
    >
      <Card className="h-full">
        <div className="flex flex-col items-start space-y-4">
          {/* Icon */}
          <div className="p-3 bg-landing-primary/10 rounded-xl">
            <Icon className="w-6 h-6 text-landing-primary" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-landing-primary">
            {title}
          </h3>

          {/* Description */}
          <p className="text-landing-primary/70 leading-relaxed">
            {description}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
