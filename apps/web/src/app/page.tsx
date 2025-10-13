import { Navigation } from '@/components/landing/navigation'
import { Hero } from '@/components/landing/hero'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-landing-light">
        <Hero />

        {/* Placeholder sections - Will be added in Jour 3, 4, 5 */}
        <section id="features" className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-landing-primary mb-4">Features Section</h2>
            <p className="text-landing-primary/70">Coming in Jour 3...</p>
          </div>
        </section>

        <section id="pricing" className="min-h-screen flex items-center justify-center bg-landing-light">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-landing-primary mb-4">Pricing Section</h2>
            <p className="text-landing-primary/70">Coming in Jour 4...</p>
          </div>
        </section>

        <section id="testimonials" className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-landing-primary mb-4">Testimonials Section</h2>
            <p className="text-landing-primary/70">Coming in Jour 4...</p>
          </div>
        </section>

        <section id="faq" className="min-h-screen flex items-center justify-center bg-landing-light">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-landing-primary mb-4">FAQ Section</h2>
            <p className="text-landing-primary/70">Coming in Jour 4...</p>
          </div>
        </section>
      </main>
    </>
  )
}
