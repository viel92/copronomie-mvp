'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container } from '../ui'
import { Building2, TrendingUp, Star } from 'lucide-react'

const stats = [
  {
    icon: Building2,
    value: '150+',
    label: 'Syndics actifs',
  },
  {
    icon: TrendingUp,
    value: '2,300+',
    label: 'Projets publiés',
  },
  {
    icon: Star,
    value: '98%',
    label: 'Taux de satisfaction',
  },
]

export function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-16 bg-white">
      <Container>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-landing-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-landing-primary" />
                </div>
              </div>

              {/* Value */}
              <div className="text-4xl md:text-5xl font-bold text-landing-primary mb-2">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-landing-secondary text-sm md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
