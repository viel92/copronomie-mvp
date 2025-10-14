# 🗺️ ROADMAP ULTRA DÉTAILLÉE - Migration Landing Page → Template Framer

**Date création**: 2025-10-14
**Source**: test.md (Documentation complète Framer Fluence AI)
**Cible**: Aligner landing page Copronomie sur template Framer
**Statut actuel**: 3 sprints complétés (941e874, f547e24, ca9f3ea)

---

## 📊 État des lieux : Ce qui a été fait (Sprints 1-3)

### ✅ Sprint 1 - Design System (commit 941e874)
- [x] Couleur primary: rgb(27,12,37) → #000 (noir pur) ✅ MATCH FRAMER
- [x] Shadows réduites: card 0 1px 2px rgba(0,0,0,0.06) ✅ MATCH FRAMER
- [x] Container max-width: 1240px ✅ MATCH FRAMER
- [x] Typography scale ajoutée (display, hero, h1-h3, lead)
- [x] Border radius: cards 16px ✅ MATCH FRAMER

### ✅ Sprint 2 - Animations (commit f547e24)
- [x] Hero delays réduits: 200ms, 400ms, 600ms
- [x] Hover effects: -4px lift uniformisé
- [x] Blobs: amplitude÷2, duration 15-20s

### ✅ Sprint 3 - Structure (commit ca9f3ea)
- [x] Navigation sticky avec blur-lg
- [x] Stats section (3 metrics animées)

---

## 🎯 PHASE 1 : Design System Complet (CRITIQUE)

### Objectif
Aligner EXACTEMENT sur le système de couleurs, typographie et spacing du template Framer.

---

### 1.1 Système de Couleurs COMPLET

**Fichier**: `apps/web/tailwind.config.ts`

#### Couleurs actuelles vs Framer

```typescript
// ❌ ACTUEL (incomplet)
landing: {
  primary: '#000000',              // ✅ OK
  secondary: '#64748B',            // ⚠️ Pas dans template
  light: 'rgb(247, 246, 247)',    // ✅ OK (/Gray)
  border: 'rgba(0, 0, 0, 0.1)',   // ✅ OK
  'overlay-light': 'rgba(255, 255, 255, 0.1)',
  'overlay-strong': 'rgba(255, 255, 255, 0.25)',
}
```

#### ✅ NOUVEAU SYSTÈME (exact match Framer)

```typescript
landing: {
  // Neutrals
  black: 'rgb(27, 12, 37)',        // /Black - Primary text, dark backgrounds
  white: 'rgb(255, 255, 255)',     // /White - Cards, backgrounds
  'gray-dark': 'rgb(237, 235, 238)', // /Gray Dark - Borders, separators
  gray: 'rgb(247, 246, 247)',      // /Gray - Page background

  // White opacity variants
  'white-100': 'rgba(255, 255, 255, 1)',
  'white-60': 'rgba(255, 255, 255, 0.6)',
  'white-50': 'rgba(255, 255, 255, 0.5)',
  'white-26': 'rgba(255, 255, 255, 0.26)',
  'white-20': 'rgba(255, 255, 255, 0.2)',
  'white-10': 'rgba(255, 255, 255, 0.1)',

  // Accents Light
  'blue-lite': 'rgb(223, 233, 253)',
  'purple-lite': 'rgb(234, 226, 242)',
  'orange-lite': 'rgb(247, 230, 221)',
  'pink-lite': 'rgb(245, 228, 239)',

  // Accents
  blue: 'rgb(128, 170, 253)',
  purple: 'rgb(211, 123, 255)',
  orange: 'rgb(252, 172, 132)',
  pink: 'rgb(255, 130, 225)',
}
```

#### Gradients

```typescript
extend: {
  backgroundImage: {
    'gradient-primary': 'linear-gradient(180deg, #F0E9F7 0%, #D588FC 60.8%, #FF49D4 100%)',
    'gradient-secondary': 'linear-gradient(180deg, white 21%, #D588FC 68%, #FF49D4 100%)',
    'gradient-multi': 'linear-gradient(90deg, #7AA7FF 0%, #CC65FF 31.087%, #FF9C6A 70.46%, #FF49D4 100%)',
  }
}
```

**Tâches** :
- [ ] Remplacer toutes les couleurs dans tailwind.config.ts
- [ ] Créer fichier `apps/web/src/styles/colors.ts` avec constants TypeScript
- [ ] Mettre à jour tous les composants pour utiliser les nouvelles couleurs
- [ ] Tester visuellement chaque section

---

### 1.2 Typographie EXACTE (General Sans)

**Problème** : On utilise Inter, le template utilise General Sans

#### Font Setup

```typescript
// apps/web/src/app/layout.tsx
import { GeneralSans } from 'next/font/google' // Si disponible
// OU import depuis Fontsource
import '@fontsource/general-sans/400.css'
import '@fontsource/general-sans/500.css'
import '@fontsource/general-sans/600.css'

const generalSans = GeneralSans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-general-sans',
})
```

#### Typography Scale (EXACT)

```typescript
// tailwind.config.ts
fontSize: {
  // ❌ SUPPRIMER NOS ANCIENS
  // 'display', 'hero', 'h1', 'h2', 'h3', 'lead'

  // ✅ NOUVEAU (exact Framer)
  'heading-1': ['76px', { lineHeight: '1em', letterSpacing: '0px', fontWeight: '500' }],
  'heading-1-tablet': ['60px', { lineHeight: '1em' }],
  'heading-1-mobile': ['44px', { lineHeight: '1em' }],

  'heading-2': ['60px', { lineHeight: '1em' }],
  'heading-2-tablet': ['48px', { lineHeight: '1em' }],
  'heading-2-mobile': ['36px', { lineHeight: '1em' }],

  'heading-3': ['44px', { lineHeight: '1.2em' }],
  'heading-3-tablet': ['36px', { lineHeight: '1.2em' }],
  'heading-3-mobile': ['28px', { lineHeight: '1.2em' }],

  'heading-4': ['32px', { lineHeight: '1.2em' }],
  'heading-4-tablet': ['28px', { lineHeight: '1.2em' }],
  'heading-4-mobile': ['24px', { lineHeight: '1.2em' }],

  'subtitle': ['24px', { lineHeight: '1.2em' }],

  'body-18': ['18px', { lineHeight: '28px', fontWeight: '400' }],
  'body-18-m': ['18px', { lineHeight: '28px', fontWeight: '500' }],
  'body-16': ['16px', { lineHeight: '26px', fontWeight: '400' }],
  'body-16-m': ['16px', { lineHeight: '26px', fontWeight: '500' }],
  'body-14': ['14px', { lineHeight: '22px' }],

  'tag': ['14px', { lineHeight: '16px', letterSpacing: '0px', fontWeight: '500', textTransform: 'uppercase' }],
}
```

**Tâches** :
- [ ] Installer General Sans font
- [ ] Mettre à jour font family dans tailwind.config.ts
- [ ] Créer utility classes `.text-heading-1`, `.text-body-18`, etc.
- [ ] Refactoriser tous les composants pour utiliser les nouveaux styles
- [ ] Responsive : appliquer breakpoints pour -tablet et -mobile

---

### 1.3 Spacing System (EXACT)

```typescript
// tailwind.config.ts
spacing: {
  // Sections
  'section-lg': '160px',
  'section-md': '140px',
  'section-sm': '100px',
  'section-xs': '80px',

  // Cards
  'card-outer-lg': '40px',
  'card-outer-md': '32px',
  'card-outer-sm': '24px',
  'card-inner-lg': '32px',
  'card-inner-md': '24px',
  'card-inner-sm': '16px',

  // Elements
  'el-lg': '32px',
  'el-md': '24px',
  'el-sm': '16px',
  'el-xs': '12px',
  'el-xxs': '8px',
}
```

---

### 1.4 Border Radius (EXACT)

```typescript
borderRadius: {
  'pill': '999px',     // Tags, toggle buttons
  'card': '16px',      // Feature cards, pricing
  'medium': '14px',    // Navigation mobile
  'container': '12px', // Images, small containers
  'button': '8px',     // Buttons, inputs, accordion
}
```

---

### 1.5 Breakpoints (EXACT Framer)

```typescript
screens: {
  'mobile': '390px',
  'tablet': '810px',
  'desktop': '1200px',
}
```

**Padding par breakpoint** :
- Desktop: 140px-160px vertical, 16px-40px horizontal
- Tablet: 80px-120px vertical, 30px horizontal
- Mobile: 64px vertical, 16px horizontal

---

## 🎯 PHASE 2 : Structure des Sections (CRITIQUE)

### Objectif
Restructurer la landing page pour matcher EXACTEMENT l'ordre et la structure du template Framer.

---

### 2.1 Structure Template Framer (ORDER)

```
1. Navigation (sticky)
2. Hero Section
3. Ticker Section ⭐ NOUVEAU
4. Stats Section (✅ déjà fait Sprint 3)
5. Features Section
6. How It Works Section ⭐ NOUVEAU
7. Testimonials Section
8. Pricing Section
9. FAQ Section
10. Footer with CTA
```

### 2.2 Structure Actuelle

```
1. Navigation ✅
2. Hero ✅
3. Stats ✅ (Sprint 3)
4. Features ✅
5. About ⚠️ (pas dans template)
6. Testimonials ✅
7. Pricing ✅
8. FAQ ✅
9. Footer ✅
```

### Écarts à corriger

#### ❌ Sections manquantes
1. **Ticker Section** (scroll horizontal infini)
2. **How It Works Section** (3 steps process)

#### ⚠️ Sections à ajuster
1. **About** → Soit supprimer, soit remplacer par "How It Works"
2. **Features** → Changer le layout (alternating left/right comme Framer)
3. **Footer** → Ajouter CTA section avant les links

---

### 2.3 Créer Ticker Section

**Fichier**: `apps/web/src/components/landing/ticker/Ticker.tsx` (NOUVEAU)

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { Star } from 'lucide-react'

export function Ticker() {
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ticker = tickerRef.current
    if (!ticker) return

    const speed = 70 // px/s comme Framer
    let animationId: number

    const animate = () => {
      if (ticker.scrollLeft >= ticker.scrollWidth / 2) {
        ticker.scrollLeft = 0
      } else {
        ticker.scrollLeft += speed / 60 // 60fps
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  const items = Array(20).fill(null).map((_, i) => (
    <div key={i} className="flex items-center gap-4 whitespace-nowrap">
      <span className="text-body-18-m text-landing-black">
        Request a demo
      </span>
      <Star className="w-6 h-6 fill-gradient-primary" />
    </div>
  ))

  return (
    <section className="py-12 bg-landing-white overflow-hidden">
      <div
        ref={tickerRef}
        className="flex gap-12 overflow-x-scroll scrollbar-hide"
        style={{ scrollBehavior: 'auto' }}
      >
        {items}
        {items} {/* Duplicate for infinite loop */}
      </div>
    </section>
  )
}
```

**Tâche** :
- [ ] Créer Ticker.tsx
- [ ] Ajouter dans page.tsx après Hero
- [ ] Tester animation smooth
- [ ] Responsive (ajuster speed sur mobile)

---

### 2.4 Créer How It Works Section

**Fichier**: `apps/web/src/components/landing/how-it-works/HowItWorks.tsx` (NOUVEAU)

```tsx
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container, Badge } from '../ui'
import Image from 'next/image'

const steps = [
  {
    image: '/images/step-1.png',
    title: 'Publiez votre projet',
    description: 'Décrivez vos travaux en quelques clics. Ajoutez votre budget et délai souhaité.',
  },
  {
    image: '/images/step-2.png',
    title: 'Recevez des devis qualifiés',
    description: 'Les entreprises de votre région vous envoient leurs meilleures offres.',
  },
  {
    image: '/images/step-3.png',
    title: 'Choisissez le meilleur',
    description: 'Acceptez le devis qui correspond à vos critères en un clic.',
  },
]

export function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="py-section-lg bg-landing-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge className="mb-4">How it works</Badge>
          <h2 className="text-heading-2 md:text-heading-2-tablet mobile:text-heading-2-mobile text-landing-black mb-6">
            Get Started in Three<br />Simple Steps
          </h2>
          <p className="text-body-18 text-landing-black/70">
            Our streamlined process makes it easy to transform your copropriété
          </p>
        </div>

        {/* Steps Grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="bg-landing-gray-dark rounded-container p-2"
            >
              {/* Image */}
              <div className="relative w-full h-64 mb-6 rounded-container overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="px-4 pb-2">
                <h3 className="text-heading-4 md:text-heading-4-tablet mobile:text-heading-4-mobile text-landing-black mb-3">
                  {step.title}
                </h3>
                <p className="text-body-16 text-landing-black/70">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
```

**Tâches** :
- [ ] Créer HowItWorks.tsx
- [ ] Créer step images (placeholders ou vraies images)
- [ ] Ajouter dans page.tsx après Features
- [ ] Tester animations stagger

---

### 2.5 Refactoriser Features Section (Alternating Layout)

**Problème** : Features actuel = grid de cards simples
**Solution** : Alternating left/right image + content comme Framer

**Fichier**: `apps/web/src/components/landing/features/FeatureShowcase.tsx` (NOUVEAU)

```tsx
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Container, Badge } from '../ui'
import { Check } from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    side: 'left',
    image: '/images/feature-1.png',
    title: 'Publication express de projets',
    description: 'Publiez vos appels d\'offres en moins de 3 minutes',
    items: [
      'Interface intuitive',
      'Templates pré-remplis',
      'Multi-projets simultanés',
    ],
  },
  {
    side: 'right',
    image: '/images/feature-2.png',
    title: 'Comparaison automatique des devis',
    description: 'Tableau de comparaison intelligent et personnalisable',
    items: [
      'Tri automatique par critères',
      'Export PDF pour AG',
      'Notifications en temps réel',
    ],
  },
  // ... plus de features
]

export function FeatureShowcase() {
  return (
    <section id="features" className="py-section-lg bg-landing-white">
      <Container>
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <Badge className="mb-4">Features</Badge>
          <h2 className="text-heading-2">
            Powerful Features to<br />Drive Your Growth
          </h2>
          <p className="text-body-18 text-landing-black/70 mt-6">
            Explore the comprehensive suite of features designed to streamline workflows
          </p>
        </div>

        {/* Feature Cards Alternating */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </Container>
    </section>
  )
}

function FeatureCard({ side, image, title, description, items, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const imageSection = (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full md:w-1/2"
    >
      <div className="relative w-full aspect-[1.069] rounded-card overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
    </motion.div>
  )

  const contentSection = (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? 50 : -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="w-full md:w-1/2 flex flex-col justify-center"
    >
      <h3 className="text-heading-3 mb-4">{title}</h3>
      <p className="text-body-18 text-landing-black/70 mb-8">{description}</p>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-landing-blue-lite rounded-full flex items-center justify-center mt-1">
              <Check className="w-4 h-4 text-landing-blue" />
            </div>
            <span className="text-body-16">{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <div ref={ref} className="flex flex-col md:flex-row items-center gap-12">
      {side === 'left' ? (
        <>
          {imageSection}
          {contentSection}
        </>
      ) : (
        <>
          {contentSection}
          {imageSection}
        </>
      )}
    </div>
  )
}
```

**Tâches** :
- [ ] Créer FeatureShowcase.tsx
- [ ] Remplacer Features actuel par FeatureShowcase dans page.tsx
- [ ] Créer feature images
- [ ] Tester alternating layout responsive

---

## 🎯 PHASE 3 : Composants Avancés (IMPORTANT)

### 3.1 Button avec Hover Animation (Dual Text Slide)

**Template Framer** : Button hover → text slide up, duplicate text slide in from bottom

**Fichier**: `apps/web/src/components/landing/ui/Button.tsx`

#### Refactoring complet

```tsx
'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center rounded-button font-medium transition-all duration-200 overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-landing-black text-landing-white hover:scale-105',
        secondary: 'bg-landing-white-26 text-landing-white hover:bg-landing-white-50',
        'secondary-2': 'bg-landing-white text-landing-black hover:bg-landing-gray-dark',
        small: 'bg-landing-white-26 text-landing-white',
      },
      size: {
        default: 'h-[50px] px-6 text-body-16-m',
        lg: 'h-[56px] px-8 text-body-18-m',
        sm: 'h-[36px] px-4 text-body-14',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
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
        {/* Dual Text Container for Hover Animation */}
        <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden group">
          {/* Text 1 - Default position */}
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-full">
            {children}
          </span>
          {/* Text 2 - Hidden below, slides in on hover */}
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0">
            {children}
          </span>
        </div>
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

**Tâches** :
- [ ] Refactoriser Button.tsx avec dual text animation
- [ ] Tester hover smooth
- [ ] Appliquer à tous les CTA du site
- [ ] Vérifier performance (60fps)

---

### 3.2 NumberCard avec Counter Animation

**Template Framer** : Numbers animate from 0 to target (react-countup, speed 88)

**Fichier**: `apps/web/src/components/landing/stats/NumberCard.tsx` (NOUVEAU)

```bash
npm install react-countup
```

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import CountUp from 'react-countup'
import { LucideIcon } from 'lucide-react'

interface NumberCardProps {
  icon: LucideIcon
  value: number
  suffix?: string
  label: string
}

export function NumberCard({ icon: Icon, value, suffix = '', label }: NumberCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [startCount, setStartCount] = useState(false)

  useEffect(() => {
    if (isInView) {
      setStartCount(true)
    }
  }, [isInView])

  return (
    <div ref={ref} className="text-center">
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-landing-black/5 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-landing-black" />
        </div>
      </div>

      {/* Animated Number */}
      <div className="text-heading-1 md:text-heading-1-tablet mobile:text-heading-1-mobile font-medium text-landing-black mb-2">
        {startCount ? (
          <CountUp
            start={0}
            end={value}
            duration={2.5}
            separator=","
            suffix={suffix}
          />
        ) : (
          `0${suffix}`
        )}
      </div>

      {/* Label */}
      <div className="text-body-16 text-landing-black/70">
        {label}
      </div>
    </div>
  )
}
```

**Tâches** :
- [ ] Créer NumberCard.tsx
- [ ] Installer react-countup
- [ ] Mettre à jour Stats.tsx pour utiliser NumberCard
- [ ] Tester animation trigger on scroll

---

### 3.3 Accordion avec Icon Rotation

**Template Framer** : Icon rotate 180deg on open/close

**Fichier**: `apps/web/src/components/landing/faq/FAQItem.tsx`

#### Refactoring

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface FAQItemProps {
  question: string
  answer: string
  defaultOpen?: boolean
}

export function FAQItem({ question, answer, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div
      className="bg-landing-gray-dark rounded-button p-5 cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* Question + Icon */}
      <div className="flex items-center justify-between">
        <h3 className="text-body-18-m text-landing-black pr-4">
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <ChevronDown className="w-5 h-5 text-landing-black flex-shrink-0" />
        </motion.div>
      </div>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="text-body-16 text-landing-black/70 mt-4">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

**Tâches** :
- [ ] Refactoriser FAQItem.tsx avec icon rotation
- [ ] Tester smooth expand/collapse
- [ ] Ajuster colors (background landing-gray-dark)
- [ ] Mettre à jour FAQ.tsx pour utiliser nouveau FAQItem

---

## 🎯 PHASE 4 : Pages & Layout (MOYEN)

### 4.1 Ordre des Sections (page.tsx)

**Fichier**: `apps/web/src/app/page.tsx`

```tsx
import { Navigation } from '@/components/landing/navigation'
import { Hero } from '@/components/landing/hero'
import { Ticker } from '@/components/landing/ticker'        // ⭐ NOUVEAU
import { Stats } from '@/components/landing/stats'
import { FeatureShowcase } from '@/components/landing/features' // ⭐ RENOMMÉ
import { HowItWorks } from '@/components/landing/how-it-works' // ⭐ NOUVEAU
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'
import { Footer } from '@/components/landing/footer'
import { JsonLd } from '@/components/landing/structured-data'

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Navigation />
      <main className="min-h-screen bg-landing-gray">
        <Hero />
        <Ticker />              {/* ⭐ NOUVEAU après Hero */}
        <Stats />               {/* ✅ Déjà fait Sprint 3 */}
        <FeatureShowcase />     {/* ⭐ Refactorisé avec alternating layout */}
        <HowItWorks />          {/* ⭐ NOUVEAU remplace About */}
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
```

**Tâches** :
- [ ] Supprimer import About
- [ ] Ajouter imports Ticker, FeatureShowcase, HowItWorks
- [ ] Réorganiser l'ordre des sections
- [ ] Tester navigation entre sections

---

### 4.2 Footer avec CTA Section

**Template Framer** : Footer a une grande CTA section AVANT les links

**Fichier**: `apps/web/src/components/landing/footer/Footer.tsx`

#### Structure attendue

```tsx
<footer className="relative bg-landing-black rounded-card mx-4 md:mx-8 mb-4">
  {/* Decorative Background Ellipses */}
  <div className="absolute top-0 left-0 w-[658px] h-[548px] bg-gradient-primary opacity-24 blur-3xl" />
  <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-gradient-multi opacity-18 blur-3xl" />

  {/* Content */}
  <div className="relative z-10 p-16">
    {/* CTA Section */}
    <div className="text-center mb-20">
      <Badge variant="secondary" className="mb-6">Join the AI Revolution</Badge>
      <h2 className="text-heading-1 text-landing-white mb-8">
        Ready to start your AI journey with us?
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="primary">Get Started</Button>
        <Button variant="secondary-2">Book a Demo</Button>
      </div>
    </div>

    {/* Separator */}
    <div className="h-px bg-landing-white/15 mb-12" />

    {/* Links Columns */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
      {/* ... columns ... */}
    </div>

    {/* Bottom Bar */}
    <div className="flex flex-col md:flex-row justify-between items-center text-body-14 text-landing-white/60">
      <p>© 2025 Copronomie. All rights reserved.</p>
      <div className="flex gap-6">
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/terms">Terms</a>
      </div>
    </div>
  </div>
</footer>
```

**Tâches** :
- [ ] Ajouter decorative ellipses avec gradients
- [ ] Ajouter CTA section en haut
- [ ] Réorganiser links columns
- [ ] Tester responsive

---

## 🎯 PHASE 5 : Animations Finales (POLISH)

### 5.1 Page Load Animations

**Template Framer** :
- Hero: Fade in from opacity 0
- Navigation: Slide down from top

**Fichiers concernés** :
- `apps/web/src/components/landing/hero/Hero.tsx`
- `apps/web/src/components/landing/navigation/Navigation.tsx`

#### Hero animations

```tsx
// Hero.tsx - Wrapper principal
<motion.section
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
  className="..."
>
```

#### Navigation slide down

```tsx
// Navigation.tsx
<motion.nav
  initial={{ y: -100, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
  className="..."
>
```

**Tâches** :
- [ ] Ajouter fade in sur Hero wrapper
- [ ] Conserver slide down Navigation (déjà présent)
- [ ] Tester timing smooth

---

### 5.2 Scroll Animations (Intersection Observer)

**Toutes les sections** doivent fade in on scroll avec Intersection Observer.

**Pattern réutilisable** :

```tsx
const ref = useRef(null)
const isInView = useInView(ref, { once: true, margin: '-100px' })

<motion.div
  ref={ref}
  initial={{ opacity: 0, y: 30 }}
  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
```

**Appliquer sur** :
- [ ] Ticker
- [ ] Stats (déjà fait ✅)
- [ ] FeatureShowcase cards
- [ ] HowItWorks steps
- [ ] Testimonials
- [ ] Pricing cards (déjà fait ✅)
- [ ] FAQ items

---

## 🎯 PHASE 6 : Responsive & Tests (FINAL)

### 6.1 Breakpoints à tester

- [ ] Desktop (1200px+)
- [ ] Tablet (810px)
- [ ] Mobile (390px)

### 6.2 Checklist Responsive

**Navigation** :
- [ ] Desktop : Full menu visible
- [ ] Mobile : Hamburger menu fonctionnel
- [ ] Sticky behavior sur tous breakpoints

**Hero** :
- [ ] Title resize : 76px → 60px → 44px
- [ ] Buttons stack verticalement sur mobile
- [ ] Image responsive

**Ticker** :
- [ ] Scroll speed ajusté sur mobile
- [ ] Pas de scroll horizontal visible

**Stats** :
- [ ] 3 colonnes → 1 colonne sur mobile
- [ ] Counter animation fonctionne sur mobile

**Features** :
- [ ] Alternating left/right → stack vertical sur mobile
- [ ] Images responsive

**How It Works** :
- [ ] 3 colonnes → 1 colonne sur mobile
- [ ] Images aspect ratio maintenu

**Testimonials** :
- [ ] Slider fonctionne sur mobile (swipe)

**Pricing** :
- [ ] 3 cards horizontales → stack vertical sur mobile
- [ ] Toggle fonctionne

**FAQ** :
- [ ] Accordion expand/collapse sur mobile
- [ ] Padding ajusté

**Footer** :
- [ ] CTA section centrée sur mobile
- [ ] Links columns stack

---

## 🎯 PHASE 7 : Performance & SEO (BONUS)

### 7.1 Images Optimization

```bash
# Installer sharp pour next/image optimization
npm install sharp
```

- [ ] Toutes les images en WebP
- [ ] Lazy loading sur images below fold
- [ ] Placeholder blur sur images

### 7.2 Fonts Optimization

- [ ] Font preload dans layout.tsx
- [ ] Font display: swap
- [ ] Subset fonts (latin only)

### 7.3 Animation Performance

- [ ] Utiliser transform au lieu de top/left/width/height
- [ ] will-change sur éléments animés
- [ ] Framer Motion optimizations

---

## 📊 Résumé des Tâches par Priorité

### 🔴 CRITIQUE (à faire en premier)

1. **Phase 1** : Design System complet (couleurs, typo, spacing)
2. **Phase 2.3** : Ticker Section
3. **Phase 2.4** : How It Works Section
4. **Phase 2.5** : FeatureShowcase alternating
5. **Phase 3.1** : Button dual text animation

### 🟠 IMPORTANT (à faire ensuite)

6. **Phase 3.2** : NumberCard counter animation
7. **Phase 3.3** : Accordion icon rotation
8. **Phase 4.1** : Réorganiser ordre sections page.tsx
9. **Phase 4.2** : Footer avec CTA section

### 🟡 MOYEN (polish)

10. **Phase 5** : Animations finales (page load, scroll)
11. **Phase 6** : Tests responsive complets

### 🟢 BONUS (si temps)

12. **Phase 7** : Performance & SEO optimizations

---

## 📈 Estimation Temps

| Phase | Tâches | Temps estimé |
|-------|--------|--------------|
| Phase 1 | Design System | 3-4h |
| Phase 2 | Structure sections | 4-5h |
| Phase 3 | Composants avancés | 3-4h |
| Phase 4 | Pages & Layout | 2h |
| Phase 5 | Animations | 2h |
| Phase 6 | Responsive & Tests | 2-3h |
| Phase 7 | Performance (bonus) | 1-2h |
| **TOTAL** | | **17-24h** |

---

## 🎯 Plan d'Exécution Recommandé

### Sprint 4 : Design System + Core Structure (6-8h)
- Phase 1 complète (couleurs, typo, spacing)
- Ticker Section
- How It Works Section

### Sprint 5 : Components & Animations (6-8h)
- FeatureShowcase alternating
- Button dual text
- NumberCard counter
- Accordion rotation
- Footer CTA

### Sprint 6 : Polish & Responsive (4-6h)
- Réorganiser page.tsx
- Scroll animations partout
- Tests responsive complets
- Performance optimizations

---

## ✅ Checklist Finale

Avant de considérer la migration terminée :

- [ ] Toutes les couleurs matchent template Framer
- [ ] Typography General Sans installée et appliquée
- [ ] Toutes les sections présentes dans bon ordre
- [ ] Ticker animation smooth
- [ ] How It Works avec 3 steps
- [ ] Features alternating left/right
- [ ] Button hover dual text fonctionne
- [ ] NumberCard counter animation
- [ ] Accordion expand/collapse smooth
- [ ] Footer avec CTA section
- [ ] Responsive parfait sur 3 breakpoints
- [ ] Toutes animations 60fps
- [ ] Images optimisées
- [ ] Lighthouse score > 90

---

**🚀 Prêt à commencer les Sprints 4, 5 et 6 !**
