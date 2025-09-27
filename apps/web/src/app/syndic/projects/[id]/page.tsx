'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge
} from '@copronomie/ui'
import {
  ArrowLeft,
  Calendar,
  Euro,
  Building,
  FileText,
  Users,
  Loader2,
  BarChart3,
  Check,
  X
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function ProjectDetailsPage() {
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

  if (projectLoading || quotesLoading) {
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

  const project = projectData?.project
  const quotes = quotesData?.quotes || []
  const condos = condosData?.condos || []

  if (!project) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/syndic/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Projet introuvable</h1>
        </div>
        <p className="text-muted-foreground">Le projet demandé n&apos;existe pas ou vous n&apos;avez pas l&apos;autorisation de le consulter.</p>
      </div>
    )
  }

  const condo = condos.find(c => c.id === project.condo_id)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: any }> = {
      draft: { label: 'Brouillon', variant: 'secondary' },
      published: { label: 'Publié', variant: 'default' },
      analyzing: { label: 'En analyse', variant: 'secondary' },
      awarded: { label: 'Attribué', variant: 'outline' },
      completed: { label: 'Terminé', variant: 'outline' },
    }

    const config = variants[status] || variants.draft

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  const getQuoteStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: any }> = {
      draft: { label: 'Brouillon', variant: 'secondary' },
      submitted: { label: 'Soumis', variant: 'default' },
      accepted: { label: 'Accepté', variant: 'outline' },
      rejected: { label: 'Refusé', variant: 'destructive' },
    }

    const config = variants[status] || variants.draft

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="outline" onClick={() => router.push('/syndic/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground mt-1">
            Détails du projet et comparaison des devis
          </p>
        </div>
        <div className="flex gap-2">
          {quotes.length > 1 && (
            <Button variant="outline" onClick={() => router.push(`/syndic/projects/${projectId}/comparison`)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Comparaison avancée
            </Button>
          )}
          {getStatusBadge(project.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Informations du projet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground">
                {project.description || 'Aucune description fournie'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Type de travaux</h4>
                <p className="text-muted-foreground capitalize">{project.type}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Budget estimé</h4>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Euro className="h-4 w-4" />
                  <span>
                    {project.budget_min?.toLocaleString()} € - {project.budget_max?.toLocaleString()} €
                  </span>
                </div>
              </div>

              {project.deadline && (
                <div>
                  <h4 className="font-medium mb-2">Échéance</h4>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(project.deadline).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Créé le</h4>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(project.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-secondary" />
              Copropriété
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {condo ? (
              <>
                <div>
                  <h4 className="font-medium">{condo.name}</h4>
                  <p className="text-sm text-muted-foreground">{condo.address}</p>
                </div>

                {condo.units_count && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{condo.units_count} lots</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Informations de copropriété non disponibles</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Gestion des devis</h2>
          {quotes.length > 0 && (
            <Badge variant="outline">
              {quotes.length} devis reçu{quotes.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {quotes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                Aucun devis reçu pour ce projet
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {quotes.map((quote: any) => (
              <Card key={quote.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Devis #{quote.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Entreprise ID: {quote.company_id}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {getQuoteStatusBadge(quote.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4 text-muted-foreground" />
                        <span className="text-2xl font-bold">{quote.amount.toLocaleString()} €</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Créé le {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>

                    {quote.status === 'submitted' && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => acceptQuoteMutation.mutate({ id: quote.id })}
                          disabled={acceptQuoteMutation.isPending}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accepter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rejectQuoteMutation.mutate({ id: quote.id })}
                          disabled={rejectQuoteMutation.isPending}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Refuser
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}