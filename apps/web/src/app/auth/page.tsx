'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label } from "@copronomie/ui";
import { Building2, Mail, Lock, User, ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function AuthPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<'syndic' | 'company'>('syndic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      // Rediriger selon le rôle
      const redirectPath = user.role === 'company' ? '/company/dashboard' : '/syndic/dashboard';

      router.push(redirectPath);
    }
  }, [isAuthenticated, user, authLoading, router]);

  // Afficher un loader pendant la vérification de session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  // Si connecté, afficher un message pendant la redirection
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirection vers votre espace...</p>
        </div>
      </div>
    );
  }

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
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'syndic', label: 'Syndic', icon: User },
                    { value: 'company', label: 'Entreprise', icon: Building2 }
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
                  const result = await login(email, password);
                  if (result.success) {
                    // Rediriger selon le rôle
                    const userRole = result.user?.role || 'syndic';
                    const dashboardPath = userRole === 'company' ? '/company/dashboard' : '/syndic/dashboard';
                    router.push(dashboardPath);
                  } else {
                    setError(result.error || 'Erreur de connexion');
                  }
                } else {
                  // Inscription
                  const name = formData.get('name') as string;
                  const companyName = formData.get('companyName') as string;

                  if (!name) {
                    setError('Le nom complet est requis');
                    setLoading(false);
                    return;
                  }

                  if (!companyName) {
                    setError(userType === 'syndic' ? 'Le nom du syndic est requis' : 'Le nom de l\'entreprise est requis');
                    setLoading(false);
                    return;
                  }

                  const registerData = {
                    email,
                    password,
                    confirmPassword: password,
                    role: userType,
                    firstName: name.split(' ')[0],
                    lastName: name.split(' ').slice(1).join(' ') || name.split(' ')[0],
                    companyName: companyName,
                  };

                  const result = await fetch('http://localhost:4000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registerData),
                  });

                  const data = await result.json();

                  if (result.ok && data.success) {
                    // Connexion automatique après inscription
                    const loginResult = await login(email, password);
                    if (loginResult.success) {
                      const dashboardPath = userType === 'company' ? '/company/dashboard' : '/syndic/dashboard';
                      router.push(dashboardPath);
                    }
                  } else {
                    setError(data.message || 'Erreur lors de l\'inscription');
                  }
                }
              } catch (err: any) {
                setError(err.message || 'Une erreur est survenue');
              } finally {
                setLoading(false);
              }
            }}>
              {mode === 'register' && (
                <>
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
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      {userType === 'syndic' ? 'Nom du syndic' : 'Nom de l\'entreprise'}
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder={userType === 'syndic' ? 'Ex: Syndic des Jardins' : 'Ex: Bâtiment Pro SARL'}
                      required
                    />
                  </div>
                </>
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