'use client'

import { motion } from 'framer-motion'

interface HeroTitleProps {
  text: string
  className?: string
}

export function HeroTitle({ text, className }: HeroTitleProps) {
  const words = text.split(' ')

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      filter: 'blur(2px)',
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Custom easing like Framer
      },
    }),
  }

  return (
    <h1 className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={wordVariants}
          className="inline-block mr-3"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}
