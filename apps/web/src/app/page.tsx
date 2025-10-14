import { Navigation } from '@/components/landing/navigation'
import { Hero } from '@/components/landing/hero'
import { FeatureShowcase } from '@/components/landing/feature-showcase'
import { HowItWorks } from '@/components/landing/how-it-works'
import { Testimonials } from '@/components/landing/testimonials'
import { Pricing } from '@/components/landing/pricing'
import { FAQ } from '@/components/landing/faq'
import { FooterCTA } from '@/components/landing/footer-cta'
import { Footer } from '@/components/landing/footer'
import { JsonLd } from '@/components/landing/structured-data'

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Navigation />
      <main className="min-h-screen overflow-x-hidden">
        <Hero />
        <FeatureShowcase />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FooterCTA />
      </main>
      <Footer />
    </>
  )
}
