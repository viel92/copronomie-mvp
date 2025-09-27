'use client'

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@copronomie/ui";
import { Building2, Menu, LogOut, User, Code, Hammer, Users } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  role: 'syndic' | 'company' | 'condo';
}

interface HeaderProps {
  user?: User | null;
  onSignOut?: () => void;
}

export function Header({ user, onSignOut }: HeaderProps) {
  const router = useRouter();

  const handleAuthAction = () => {
    if (user) {
      onSignOut?.();
    } else {
      router.push('/auth');
    }
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Copronomie</h1>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <a href="#fonctionnalites" className="text-muted-foreground hover:text-primary transition-colors">
            Fonctionnalités
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
            Tarifs
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:inline-flex gap-2">
                  <User className="h-4 w-4" />
                  {user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onClick={() => router.push(`/${user.role}/dashboard`)}>
                  <User className="mr-2 h-4 w-4" />
                  Mon Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/syndic/dashboard')}>
                  <Building2 className="mr-2 h-4 w-4" />
                  Dashboard Syndic
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/company/dashboard')}>
                  <Hammer className="mr-2 h-4 w-4" />
                  Dashboard Entreprise
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/condo/dashboard')}>
                  <Users className="mr-2 h-4 w-4" />
                  Dashboard Copropriété
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" className="hidden md:inline-flex" onClick={handleAuthAction}>
              Connexion
            </Button>
          )}

          {!user && (
            <Button variant="hero" onClick={() => router.push('/auth')}>
              Essayer gratuitement
            </Button>
          )}

          <Button variant="outline" onClick={() => router.push('/dev')} className="hidden md:inline-flex">
            <Code className="h-4 w-4 mr-2" />
            Mode Dev
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}