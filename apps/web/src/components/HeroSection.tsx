'use client'

import { Button } from "@copronomie/ui";
import { ArrowRight, TrendingDown, Clock, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Facilitez la gestion de vos{" "}
                <span className="text-primary">devis et contrats</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Plateforme SaaS hybride qui standardise et compare les offres
                pour assurer un suivi transparent des travaux et prestataires.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="hero"
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => router.push('/auth')}
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Voir la démo
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">-20% sur les coûts</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Devis en 48h</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Entreprises certifiées</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-2 shadow-xl">
              <div className="bg-gray-200 rounded-xl w-full h-96 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Image Hero Construction
                  <br />
                  <small>(À ajouter depuis assets)</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}