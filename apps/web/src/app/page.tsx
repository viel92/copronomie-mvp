import { Button, Badge, Card, Container } from '@/components/landing/ui'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-landing-light">
      {/* Temporary test page - Will be replaced with full landing */}
      <Container className="py-24">
        <div className="text-center space-y-8">
          {/* Badge Test */}
          <Badge icon="⚡">Syndics & Copropriétaires</Badge>

          {/* Title */}
          <h1 className="text-6xl font-bold text-landing-primary leading-tight max-w-4xl mx-auto">
            La plateforme qui réinvente la gestion des devis en copropriété
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-landing-primary/80 max-w-3xl mx-auto">
            Publiez vos projets, recevez des devis qualifiés et trouvez les meilleurs artisans pour votre copropriété. Sans effort.
          </p>

          {/* CTAs */}
          <div className="flex gap-4 justify-center">
            <Button size="lg">Commencer gratuitement →</Button>
            <Button size="lg" variant="secondary">Découvrir</Button>
          </div>

          {/* Test Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card>
              <h3 className="text-xl font-semibold mb-2">Publication express</h3>
              <p className="text-gray-600">Créez et publiez un projet en moins de 3 minutes.</p>
            </Card>
            <Card glass>
              <h3 className="text-xl font-semibold mb-2">Glassmorphism Card</h3>
              <p className="text-white/80">Card avec effet glassmorphism pour tester.</p>
            </Card>
            <Card>
              <h3 className="text-xl font-semibold mb-2">Comparaison instantanée</h3>
              <p className="text-gray-600">Tableau de comparaison automatique des devis reçus.</p>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  )
}
