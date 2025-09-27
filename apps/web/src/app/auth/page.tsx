'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from "@copronomie/ui";
import { Building2, Mail, Lock, User, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<'syndic' | 'company' | 'condo'>('syndic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">Copronomie</h1>
            </div>
            <CardTitle className="text-2xl">
              {mode === 'login' ? 'Connexion' : 'Créer un compte'}
            </CardTitle>
            <p className="text-muted-foreground">
              {mode === 'login'
                ? 'Connectez-vous à votre espace'
                : 'Rejoignez la plateforme Copronomie'
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-3">
                <Label htmlFor="userType">Type de compte</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'syndic', label: 'Syndic', icon: User },
                    { value: 'company', label: 'Entreprise', icon: Building2 },
                    { value: 'condo', label: 'Copropriété', icon: User }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setUserType(type.value as any)}
                      className={`p-3 text-xs border rounded-lg transition-colors ${
                        userType === type.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <type.icon className="h-4 w-4 mx-auto mb-1" />
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);

              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              const password = formData.get('password') as string;

              try {
                if (mode === 'login') {
                  const result = await authService.login({ email, password });
                  const role = result.user?.role || 'syndic';
                  const dashboardPath = `/${role}/dashboard`;
                  router.push(dashboardPath);
                } else {
                  const confirmPassword = formData.get('confirmPassword') as string;
                  const name = formData.get('name') as string;

                  await authService.register({
                    email,
                    password,
                    confirmPassword,
                    role: userType,
                    firstName: name,
                  });

                  setError('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
                }
              } catch (err: any) {
                setError(err.message || 'Une erreur est survenue');
              } finally {
                setLoading(false);
              }
            }}>
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Votre nom complet"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>

              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              {error && (
                <div className={`text-sm p-3 rounded-lg ${
                  error.includes('réussie') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {error}
                </div>
              )}

              <Button className="w-full" variant="hero" type="submit" disabled={loading}>
                {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {mode === 'login'
                  ? "Pas encore de compte ? S'inscrire"
                  : "Déjà un compte ? Se connecter"
                }
              </button>

              {mode === 'login' && (
                <div className="text-sm">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>
              )}
            </div>

            {mode === 'register' && (
              <div className="text-xs text-center text-muted-foreground">
                En créant un compte, vous acceptez les{' '}
                <a href="#" className="text-primary hover:underline">
                  conditions d&apos;utilisation
                </a>{' '}
                et la{' '}
                <a href="#" className="text-primary hover:underline">
                  politique de confidentialité de COPRONOMIE
                </a>
                .
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Vos données sont sécurisées et chiffrées
          </p>
        </div>
      </div>
    </div>
  );
}