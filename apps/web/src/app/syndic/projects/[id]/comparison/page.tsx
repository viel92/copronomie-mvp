'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@copronomie/ui'
import {
  ArrowLeft,
  Download,
  Share2,
  BarChart3,
  TrendingUp,
  Euro,
  Calendar,
  Star,
  Loader2,
  Check,
  X
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function ProjectComparisonPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const { data: projectData, isLoading: projectLoading } = trpc.projects.getById.useQuery({ id: projectId })
  const { data: quotesData, isLoading: quotesLoading } = trpc.quotes.getByProject.useQuery({ projectId })
  const { data: condosData } = trpc.condos.getAll.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  const acceptQuoteMutation = trpc.quotes.accept.useMutation({
    onSuccess: () => {
      toast.success('Devis accepté avec succès')
    },
    onError: () => {
      toast.error("Erreur lors de l'acceptation du devis")
    }
  })

  const rejectQuoteMutation = trpc.quotes.reject.useMutation({
    onSuccess: () => {
      toast.success('Devis refusé')
    },
    onError: () => {
      toast.error("Erreur lors du refus du devis")
    }
  })

  const exportComparison = async () => {
    toast.success('Export en cours - Fonctionnalité à venir')
  }

  const shareComparison = async () => {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    toast.success('Lien de partage copié dans le presse-papiers')
  }

  if (projectLoading || quotesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement de la comparaison...</span>
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

  const project = projectData?.project
  const quotes = quotesData?.quotes || []
  const condos = condosData?.condos || []

  if (!project) {
    return (
      <div className="p-8 space-y-6">
        <Button variant="outline" onClick={() => router.push('/syndic/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </Button>
        <p className="text-muted-foreground">Projet non trouvé</p>
      </div>
    )
  }

  const condo = condos.find(c => c.id === project.condo_id)

  const avgPrice = quotes.length > 0 ? quotes.reduce((sum: number, q: any) => sum + q.amount, 0) / quotes.length : 0

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/syndic/projects/${projectId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au projet
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <p className="text-muted-foreground">
              Comparaison avancée des devis • {condo?.name}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportComparison}>
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
          <Button variant="outline" onClick={shareComparison}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Total devis</div>
                <div className="font-bold">{quotes.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-success" />
              <div>
                <div className="text-sm text-muted-foreground">Prix moyen</div>
                <div className="font-bold">
                  {avgPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-warning" />
              <div>
                <div className="text-sm text-muted-foreground">Délai estimé</div>
                <div className="font-bold">À déterminer</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <div>
                <div className="text-sm text-muted-foreground">Note moy.</div>
                <div className="font-bold">N/A</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Vue tableau</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-6">
          {quotes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Aucun devis à afficher</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Tableau comparatif détaillé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Devis</th>
                        <th className="text-right p-2">Prix</th>
                        <th className="text-center p-2">Statut</th>
                        <th className="text-center p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.map((quote: any) => (
                        <tr key={quote.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">Devis #{quote.id.slice(0, 8)}</div>
                              <div className="text-xs text-muted-foreground">
                                Créé le {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </td>
                          <td className="text-right p-2 font-medium">
                            {quote.amount.toLocaleString('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            })}
                          </td>
                          <td className="text-center p-2">
                            <Badge
                              variant={
                                quote.status === 'accepted' ? 'outline' :
                                quote.status === 'rejected' ? 'destructive' :
                                'secondary'
                              }
                            >
                              {quote.status === 'accepted' ? 'Accepté' :
                               quote.status === 'rejected' ? 'Refusé' :
                               'En attente'
                              }
                            </Badge>
                          </td>
                          <td className="text-center p-2">
                            <div className="flex gap-1 justify-center">
                              {quote.status !== 'accepted' && (
                                <Button
                                  size="sm"
                                  onClick={() => acceptQuoteMutation.mutate({ id: quote.id })}
                                  disabled={acceptQuoteMutation.isPending}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Accepter
                                </Button>
                              )}
                              {quote.status !== 'rejected' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => rejectQuoteMutation.mutate({ id: quote.id })}
                                  disabled={rejectQuoteMutation.isPending}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Refuser
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analytics des devis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                <p className="mb-4">Analyse des tendances et recommandations :</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>
                    <strong>Écart de prix :</strong> {
                      quotes.length > 1
                        ? `${((Math.max(...quotes.map((q: any) => q.amount)) - Math.min(...quotes.map((q: any) => q.amount))) / Math.min(...quotes.map((q: any) => q.amount)) * 100).toFixed(1)}%`
                        : 'N/A'
                    }
                  </li>
                  <li>
                    <strong>Devis le moins cher :</strong> {
                      quotes.length > 0
                        ? Math.min(...quotes.map((q: any) => q.amount)).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
                        : 'N/A'
                    }
                  </li>
                  <li>
                    <strong>Devis le plus cher :</strong> {
                      quotes.length > 0
                        ? Math.max(...quotes.map((q: any) => q.amount)).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
                        : 'N/A'
                    }
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}