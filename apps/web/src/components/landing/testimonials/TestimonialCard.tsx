'use client'

import { motion } from 'framer-motion'
import { Card } from '../ui'
import { Quote } from 'lucide-react'

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  company: string
  index?: number
}

export function TestimonialCard({ quote, author, role, company, index = 0 }: TestimonialCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      className="h-full"
    >
      <Card className="h-full flex flex-col justify-between p-8 transition-shadow duration-300 hover:shadow-xl">
        {/* Quote Icon */}
        <div className="mb-6">
          <div className="w-12 h-12 bg-landing-primary/10 rounded-full flex items-center justify-center">
            <Quote className="w-6 h-6 text-landing-primary" />
          </div>
        </div>

      {/* Quote Text */}
      <p className="text-lg text-landing-primary/80 leading-relaxed mb-6 flex-grow">
        "{quote}"
      </p>

        {/* Author Info */}
        <div className="border-t border-landing-primary/10 pt-6">
          <p className="font-semibold text-landing-primary">{author}</p>
          <p className="text-sm text-landing-primary/60">
            {role} - {company}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
