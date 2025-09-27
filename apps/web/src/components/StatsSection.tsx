import { Card, CardContent } from "@copronomie/ui";
import { TrendingUp, Clock, Euro, Users, Building2, FileCheck } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: "20%",
      label: "Économies moyennes",
      description: "Réduction des coûts grâce aux comparaisons",
      color: "success"
    },
    {
      icon: Clock,
      value: "48h",
      label: "Délai moyen",
      description: "Réception des premiers devis",
      color: "secondary"
    },
    {
      icon: Users,
      value: "2,850+",
      label: "Utilisateurs actifs",
      description: "Syndics, entreprises et copropriétés",
      color: "primary"
    },
    {
      icon: Building2,
      value: "1,850+",
      label: "Entreprises certifiées",
      description: "Prestataires qualifiés et vérifiés",
      color: "primary"
    },
    {
      icon: FileCheck,
      value: "15,200+",
      label: "Devis traités",
      description: "Depuis le lancement de la plateforme",
      color: "secondary"
    },
    {
      icon: Euro,
      value: "1.2M€",
      label: "Économies générées",
      description: "Total des économies pour nos clients",
      color: "success"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return "text-primary bg-primary/10";
      case "secondary":
        return "text-blue-600 bg-blue-100";
      case "success":
        return "text-green-600 bg-green-100";
      default:
        return "text-primary bg-primary/10";
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Des Résultats Qui Parlent
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nos clients font confiance à Copronomie pour standardiser leurs devis
            et assurer un suivi transparent de leurs prestataires
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <Card
                key={index}
                className="bg-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="mx-auto w-fit">
                    <div className={`p-4 rounded-2xl ${getColorClasses(stat.color)}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xl font-semibold text-foreground">
                      {stat.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}