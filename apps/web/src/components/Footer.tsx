import { Building2, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import { Button } from "@copronomie/ui";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold">Copronomie</h3>
            </div>
            <p className="text-background/80 leading-relaxed">
              Plateforme SaaS hybride qui facilite la gestion des devis et contrats
              en copropriété en standardisant et comparant les offres reçues.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Solutions</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">Pour Syndics</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">Pour Entreprises BTP</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">Pour Copropriétés</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">Système de parrainage</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">Centre d&apos;aide</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">Documentation API</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">Formations</a></li>
              <li><a href="#" className="text-background/80 hover:text-primary transition-colors">Status</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-background/80">
                <Mail className="h-4 w-4" />
                <span>contact@copronomie.fr</span>
              </div>
              <div className="flex items-center gap-2 text-background/80">
                <Phone className="h-4 w-4" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center gap-2 text-background/80">
                <MapPin className="h-4 w-4" />
                <span>75001 Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center">
          <p className="text-background/60">
            © 2025 Copronomie. Tous droits réservés. |
            <a href="#" className="hover:text-primary transition-colors"> Mentions légales</a> |
            <a href="#" className="hover:text-primary transition-colors"> Confidentialité</a> |
            <a href="#" className="hover:text-primary transition-colors"> CGU</a>
          </p>
        </div>
      </div>
    </footer>
  );
}