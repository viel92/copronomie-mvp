import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mentions Légales | Copronomie',
  description: 'Mentions légales de Copronomie',
}

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-landing-white py-24 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-landing-primary/70 hover:text-landing-primary transition-colors mb-8 group"
          >
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Retour à l'accueil
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-landing-blue-lite rounded-pill text-sm font-medium text-landing-black">
              Informations légales
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-landing-black mb-4">
              Mentions Légales
            </h1>
            <p className="text-landing-secondary">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                1. Éditeur du site
              </h2>
              <p className="text-landing-secondary mb-2">
                <strong>Raison sociale :</strong> Copronomie SAS
              </p>
              <p className="text-landing-secondary mb-2">
                <strong>Capital social :</strong> [Montant] €
              </p>
              <p className="text-landing-secondary mb-2">
                <strong>SIRET :</strong> [Numéro SIRET]
              </p>
              <p className="text-landing-secondary mb-2">
                <strong>Siège social :</strong> [Adresse complète]
              </p>
              <p className="text-landing-secondary mb-2">
                <strong>Email :</strong> <a href="mailto:contact@copronomie.fr" className="text-landing-purple font-semibold hover:underline">contact@copronomie.fr</a>
              </p>
              <p className="text-landing-secondary">
                <strong>Directeur de la publication :</strong> [Nom du directeur]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                2. Hébergement
              </h2>
              <p className="text-landing-secondary mb-2">
                Le site est hébergé par :
              </p>
              <p className="text-landing-secondary mb-2">
                <strong>Vercel Inc.</strong>
              </p>
              <p className="text-landing-secondary mb-2">
                340 S Lemon Ave #4133, Walnut, CA 91789, USA
              </p>
              <p className="text-landing-secondary">
                Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-landing-purple font-semibold hover:underline">https://vercel.com</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                3. Propriété intellectuelle
              </h2>
              <p className="text-landing-secondary mb-4">
                L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes) est la propriété exclusive de Copronomie SAS, sauf mention contraire.
              </p>
              <p className="text-landing-secondary">
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de Copronomie SAS.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                4. Données personnelles
              </h2>
              <p className="text-landing-secondary mb-4">
                Conformément à la loi "Informatique et Libertés" du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez de droits sur vos données personnelles.
              </p>
              <p className="text-landing-secondary">
                Pour plus d'informations, consultez notre <Link href="/privacy-policy" className="text-landing-purple font-semibold hover:underline">Politique de Confidentialité</Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                5. Cookies
              </h2>
              <p className="text-landing-secondary">
                Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie publicitaire ou de tracking n'est utilisé sans votre consentement préalable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                6. Limitation de responsabilité
              </h2>
              <p className="text-landing-secondary mb-4">
                Copronomie s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, Copronomie ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
              </p>
              <p className="text-landing-secondary">
                Copronomie ne saurait être tenue responsable des dommages directs ou indirects résultant de l'accès au site ou de l'utilisation de celui-ci.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                7. Droit applicable et juridiction
              </h2>
              <p className="text-landing-secondary">
                Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
              </p>
            </section>
          </div>
        </div>
      </div>
  )
}
