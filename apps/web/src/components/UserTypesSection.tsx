'use client'

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@copronomie/ui";
import {
  UserCheck,
  Building,
  Users,
  TrendingUp,
  FileText,
  Star,
  BarChart3,
  Euro,
  CheckCircle
} from "lucide-react";

export function UserTypesSection() {
  const userTypes = [
    {
      title: "SYNDIC",
      subtitle: "Gestionnaire principal",
      icon: UserCheck,
      description: "Créez et gérez vos projets de travaux avec une vue d'ensemble complète",
      color: "primary",
      price: "49€/mois",
      features: [
        "Projets illimités",
        "Gestion des copropriétés (CRUD)",
        "Comparaison des devis",
        "Système de parrainage",
        "Analytics avancés",
        "Commission 20% sur parrainages"
      ],
      metrics: [
        { label: "Projets gérés", value: "2,450+" },
        { label: "Copropriétés", value: "850+" },
        { label: "Économies générées", value: "1.2M€" }
      ]
    },
    {
      title: "ENTREPRISE",
      subtitle: "Prestataire BTP",
      icon: Building,
      description: "Trouvez des projets qualifiés et soumettez vos devis en toute simplicité",
      color: "secondary",
      price: "29€-79€/mois",
      features: [
        "Projets par spécialité",
        "Devis structurés",
        "Profil certifications",
        "Suivi des devis",
        "Système de notation",
        "Support prioritaire"
      ],
      metrics: [
        { label: "Devis soumis", value: "15,200+" },
        { label: "Taux d'acceptation", value: "34%" },
        { label: "Entreprises actives", value: "1,850+" }
      ]
    },
    {
      title: "COPROPRIÉTÉ",
      subtitle: "Client final",
      icon: Users,
      description: "Suivez l'avancement de vos travaux et restez informés en temps réel",
      color: "success",
      price: "19€-59€/mois",
      features: [
        "Suivi des projets",
        "Notifications temps réel",
        "Visualisation des devis",
        "Décisions collaboratives",
        "Historique complet",
        "Support dédié"
      ],
      metrics: [
        { label: "Copropriétés actives", value: "950+" },
        { label: "Satisfaction", value: "94%" },
        { label: "Projets finalisés", value: "3,100+" }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return {
          border: "border-primary/20",
          icon: "text-primary",
          badge: "bg-primary text-primary-foreground"
        };
      case "secondary":
        return {
          border: "border-secondary/20",
          icon: "text-secondary",
          badge: "bg-secondary text-secondary-foreground"
        };
      case "success":
        return {
          border: "border-green-200",
          icon: "text-green-600",
          badge: "bg-green-600 text-white"
        };
      default:
        return {
          border: "border-primary/20",
          icon: "text-primary",
          badge: "bg-primary text-primary-foreground"
        };
    }
  };

  return (
    <section id="fonctionnalites" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            3 Profils Utilisateurs, 1 Plateforme Unifiée
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Chaque acteur dispose d&apos;un environnement dédié avec des fonctionnalités
            spécifiques pour optimiser sa productivité
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {userTypes.map((type, index) => {
            const colors = getColorClasses(type.color);
            const Icon = type.icon;

            return (
              <Card
                key={index}
                className={`relative bg-gradient-to-br from-white to-gray-50 ${colors.border} border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
                    <Icon className={`h-8 w-8 ${colors.icon}`} />
                  </div>

                  <div className="space-y-2">
                    <Badge className={colors.badge}>
                      {type.title}
                    </Badge>
                    <CardTitle className="text-2xl">{type.subtitle}</CardTitle>
                    <p className="text-muted-foreground">{type.description}</p>
                  </div>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <span className="text-3xl font-bold text-foreground">{type.price}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Fonctionnalités incluses
                    </h4>
                    <ul className="space-y-2">
                      {type.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full ${type.color === 'primary' ? 'bg-primary' : type.color === 'secondary' ? 'bg-secondary' : 'bg-green-600'}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border">
                    <h4 className="font-semibold flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      Métriques clés
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {type.metrics.map((metric, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{metric.label}</span>
                          <span className="font-semibold text-foreground">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full mt-6" variant={type.color === "primary" ? "hero" : "default"}>
                    Commencer maintenant
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}