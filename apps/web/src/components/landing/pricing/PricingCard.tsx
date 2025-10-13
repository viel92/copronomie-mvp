'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check } from 'lucide-react'
import { Card, Button, Badge } from '../ui'
import Link from 'next/link'

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  index: number
}

export function PricingCard({
  name,
  price,
  description,
  features,
  popular = false,
  index
}: PricingCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{
        y: -12,
        scale: popular ? 1.02 : 1.05,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      className="h-full"
    >
      <Card
        className={`h-full flex flex-col relative transition-shadow duration-300 ${popular ? 'ring-2 ring-landing-primary shadow-card-hover' : 'hover:shadow-xl'}`}
      >
        {popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <Badge className="bg-landing-primary text-white px-4 py-1">
              Plus populaire
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-landing-primary mb-2">{name}</h3>
          <p className="text-landing-primary/60 text-sm">{description}</p>
        </div>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-landing-primary">{price}</span>
            {price !== 'Gratuit' && (
              <span className="text-landing-primary/60">/mois</span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-4 mb-8 flex-grow">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-landing-primary/80 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          variant={popular ? 'primary' : 'outline'}
          size="lg"
          className="w-full"
          asChild
        >
          <Link href="/register">Commencer maintenant</Link>
        </Button>
      </Card>
    </motion.div>
  )
}
