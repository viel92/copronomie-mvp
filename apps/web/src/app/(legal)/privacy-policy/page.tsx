import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Copronomie',
  description: 'Politique de confidentialité et protection des données de Copronomie',
}

export default function PrivacyPolicyPage() {
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
            <div className="inline-block mb-4 px-4 py-2 bg-landing-purple-lite rounded-pill text-sm font-medium text-landing-black">
              Politique de confidentialité
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-landing-black mb-4">
              Politique de Confidentialité
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
                1. Collecte des informations
              </h2>
              <p className="text-landing-secondary mb-4">
                Chez Copronomie, nous collectons les informations suivantes :
              </p>
              <ul className="list-disc pl-6 text-landing-secondary space-y-2">
                <li>Informations d'identification (nom, prénom, email)</li>
                <li>Informations professionnelles (nom du cabinet, SIRET pour les syndics)</li>
                <li>Informations sur les copropriétés gérées</li>
                <li>Données de navigation et d'utilisation de la plateforme</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                2. Utilisation des données
              </h2>
              <p className="text-landing-secondary mb-4">
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc pl-6 text-landing-secondary space-y-2">
                <li>Fournir et améliorer nos services</li>
                <li>Mettre en relation syndics et artisans qualifiés</li>
                <li>Envoyer des notifications concernant vos projets</li>
                <li>Assurer la sécurité et prévenir la fraude</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                3. Protection des données
              </h2>
              <p className="text-landing-secondary mb-4">
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès, modification, divulgation ou destruction non autorisés.
              </p>
              <p className="text-landing-secondary">
                Vos données sont hébergées sur des serveurs sécurisés en Europe et sont chiffrées lors de leur transmission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                4. Partage des données
              </h2>
              <p className="text-landing-secondary mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons les partager uniquement dans les cas suivants :
              </p>
              <ul className="list-disc pl-6 text-landing-secondary space-y-2">
                <li>Avec les artisans pour les projets que vous publiez</li>
                <li>Avec nos prestataires de services (hébergement, email)</li>
                <li>Si requis par la loi ou une autorité judiciaire</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                5. Vos droits
              </h2>
              <p className="text-landing-secondary mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 text-landing-secondary space-y-2">
                <li>Droit d'accès à vos données</li>
                <li>Droit de rectification</li>
                <li>Droit à l'effacement</li>
                <li>Droit à la limitation du traitement</li>
                <li>Droit à la portabilité</li>
                <li>Droit d'opposition</li>
              </ul>
              <p className="text-landing-secondary mt-4">
                Pour exercer ces droits, contactez-nous à : <a href="mailto:privacy@copronomie.fr" className="text-landing-purple font-semibold hover:underline">privacy@copronomie.fr</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                6. Cookies
              </h2>
              <p className="text-landing-secondary">
                Nous utilisons des cookies strictement nécessaires au fonctionnement de la plateforme. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela peut affecter certaines fonctionnalités.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-landing-black mb-4">
                7. Contact
              </h2>
              <p className="text-landing-secondary">
                Pour toute question concernant cette politique de confidentialité, contactez-nous :
              </p>
              <ul className="list-none text-landing-secondary space-y-2 mt-4">
                <li>Email : <a href="mailto:privacy@copronomie.fr" className="text-landing-purple font-semibold hover:underline">privacy@copronomie.fr</a></li>
                <li>Adresse : Copronomie SAS, [Votre adresse]</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
  )
}
