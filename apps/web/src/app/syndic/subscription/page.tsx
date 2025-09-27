'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Separator
} from '@copronomie/ui'
import {
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Crown,
  Loader2,
  Star
} from 'lucide-react'

export default function SubscriptionPage() {
  const { data: user, isLoading: userLoading } = trpc.auth.me.useQuery()

  const { data: subscriptionData, isLoading: subscriptionLoading } = trpc.subscriptions.getByEntity.useQuery(
    {
      entityId: user?.user?.id || '',
      entityType: 'syndic',
    },
    {
      enabled: !!user?.user?.id,
    }
  )

  if (userLoading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user?.user?.role !== 'syndic') {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    )
  }

  const subscription = subscriptionData?.subscription

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3 mr-1" /> Actif
          </Badge>
        )
      case 'trialing':
        return (
          <Badge className="bg-warning text-warning-foreground">
            <Star className="h-3 w-3 mr-1" /> Période d&apos;essai
          </Badge>
        )
      case 'canceled':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" /> Annulé
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'basic':
        return 'Plan Basique'
      case 'premium':
        return 'Plan Premium'
      case 'enterprise':
        return 'Plan Entreprise'
      default:
        return plan
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Abonnement</h1>
        <p className="text-muted-foreground mt-1">
          Gérez votre abonnement et vos options de facturation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Abonnement actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Plan actuel</span>
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{getPlanName(subscription.plan)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Statut</span>
                  {getStatusBadge(subscription.status)}
                </div>

                {subscription.trial_ends_at && subscription.status === 'trialing' && (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Fin de la période d&apos;essai</span>
                    <span className="text-sm">
                      {new Date(subscription.trial_ends_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="font-medium">Période de facturation</span>
                  <span className="text-sm">
                    {new Date(subscription.current_period_start).toLocaleDateString('fr-FR')} -{' '}
                    {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Modifier le plan
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Gérer la facturation
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">Aucun abonnement actif</h3>
                <p className="text-muted-foreground mb-4">
                  Vous n&apos;avez pas encore d&apos;abonnement. Choisissez un plan pour commencer.
                </p>
                <Button>Choisir un plan</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-secondary" />
              Plans disponibles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border border-border rounded-lg">
                <div className="font-medium">Plan Basique</div>
                <div className="text-2xl font-bold">
                  29€<span className="text-sm font-normal">/mois</span>
                </div>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Jusqu&apos;à 5 copropriétés</li>
                  <li>• Support par email</li>
                  <li>• Fonctionnalités de base</li>
                </ul>
              </div>

              <div className="p-3 border-2 border-primary rounded-lg bg-primary/5">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Plan Premium</span>
                  <Badge variant="default" className="text-xs">
                    Populaire
                  </Badge>
                </div>
                <div className="text-2xl font-bold">
                  79€<span className="text-sm font-normal">/mois</span>
                </div>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Copropriétés illimitées</li>
                  <li>• Support prioritaire</li>
                  <li>• Analytics avancées</li>
                  <li>• API access</li>
                </ul>
              </div>

              <div className="p-3 border border-border rounded-lg">
                <div className="font-medium">Plan Entreprise</div>
                <div className="text-2xl font-bold">Sur mesure</div>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Solutions personnalisées</li>
                  <li>• Support dédié</li>
                  <li>• Intégrations sur mesure</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}