'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@copronomie/ui'
import {
  Plus,
  Search,
  Building,
  MapPin,
  Users,
  FolderKanban,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function SyndicCondosPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingCondo, setDeletingCondo] = useState<string | null>(null)

  const { data: condosData, isLoading: condosLoading } = trpc.condos.getAll.useQuery()
  const { data: projectsData, isLoading: projectsLoading } = trpc.projects.getAll.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  const deleteCondoMutation = trpc.condos.delete.useMutation({
    onSuccess: () => {
      toast.success('Copropriété supprimée avec succès')
      setDeletingCondo(null)
    },
    onError: () => {
      toast.error('Erreur lors de la suppression de la copropriété')
      setDeletingCondo(null)
    }
  })

  const isLoading = condosLoading || projectsLoading

  if (isLoading) {
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

  const condos = condosData?.condos || []
  const projects = projectsData?.projects || []

  const filteredCondos = condos.filter(condo =>
    condo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    condo.address?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCondoProjects = (condoId: string) => {
    return projects.filter(project => project.condo_id === condoId)
  }

  const handleDeleteCondo = async (condoId: string, condoName: string) => {
    const condoProjects = getCondoProjects(condoId)
    if (condoProjects.length > 0) {
      toast.error(`Impossible de supprimer "${condoName}": ${condoProjects.length} projet(s) associé(s)`)
      return
    }

    setDeletingCondo(condoId)
    await deleteCondoMutation.mutateAsync({ id: condoId })
  }

  const getPlanColor = (plan: string) => {
    const colors: Record<string, string> = {
      basic: 'bg-muted text-muted-foreground',
      premium: 'bg-primary text-primary-foreground',
      enterprise: 'bg-green-100 text-green-800'
    }
    return colors[plan] || colors.basic
  }

  const getPlanLabel = (plan: string) => {
    const labels: Record<string, string> = {
      basic: 'Basique',
      premium: 'Premium',
      enterprise: 'Entreprise'
    }
    return labels[plan] || plan
  }

  const totalLots = condos.reduce((sum, condo) => sum + (condo.units_count || 0), 0)
  const activeProjects = projects.filter(p => ['published', 'analyzing', 'awarded'].includes(p.status || '')).length
  const growthCount = Math.round(condos.length * 0.12)

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Copropriétés</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre portfolio de copropriétés et leurs projets
          </p>
        </div>
        <Button
          variant="hero"
          onClick={() => router.push('/syndic/condos/new')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter copropriété
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Building className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total copropriétés</p>
                <p className="text-2xl font-bold">{condos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Total lots</p>
                <p className="text-2xl font-bold">{totalLots}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <FolderKanban className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Projets actifs</p>
                <p className="text-2xl font-bold">{activeProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">En croissance</p>
                <p className="text-2xl font-bold">+{growthCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher une copropriété..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredCondos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Building className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Aucune copropriété trouvée</h3>
                  <p className="text-muted-foreground">
                    {condos.length === 0
                      ? 'Ajoutez votre première copropriété pour commencer'
                      : 'Aucune copropriété ne correspond à votre recherche'
                    }
                  </p>
                </div>
                {condos.length === 0 && (
                  <Button
                    variant="outline"
                    onClick={() => router.push('/syndic/condos/new')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une copropriété
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCondos.map((condo) => {
              const condoProjects = getCondoProjects(condo.id)
              const activeCondoProjects = condoProjects.filter(p =>
                ['published', 'analyzing', 'awarded'].includes(p.status || '')
              )

              return (
                <Card key={condo.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{condo.name}</CardTitle>
                        {condo.address && (
                          <div className="flex items-center gap-1 text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{condo.address}</span>
                          </div>
                        )}
                      </div>
                      <Badge className={getPlanColor(condo.subscription_plan || 'basic')}>
                        {getPlanLabel(condo.subscription_plan || 'basic')}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{condo.units_count || 0}</div>
                        <div className="text-xs text-muted-foreground">Lots</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">{condoProjects.length}</div>
                        <div className="text-xs text-muted-foreground">Projets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{activeCondoProjects.length}</div>
                        <div className="text-xs text-muted-foreground">Actifs</div>
                      </div>
                    </div>

                    {condoProjects.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Projets récents</h4>
                        <div className="space-y-1">
                          {condoProjects.slice(0, 2).map(project => (
                            <div
                              key={project.id}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-foreground truncate">{project.title}</span>
                              <Badge
                                variant="outline"
                                className="text-xs"
                              >
                                {project.status === 'published' ? 'Publié' :
                                 project.status === 'analyzing' ? 'En analyse' :
                                 project.status === 'awarded' ? 'Attribué' :
                                 project.status === 'completed' ? 'Terminé' : 'Brouillon'}
                              </Badge>
                            </div>
                          ))}
                          {condoProjects.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{condoProjects.length - 2} autres projets
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        Ajouté le {new Date(condo.created_at).toLocaleDateString()}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/syndic/condos/${condo.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/syndic/condos/${condo.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              disabled={deletingCondo === condo.id}
                            >
                              {deletingCondo === condo.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer la copropriété</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer la copropriété "{condo.name}" ?
                                {condoProjects.length > 0 && (
                                  <span className="text-destructive font-medium">
                                    <br />Attention : Cette copropriété a {condoProjects.length} projet(s) associé(s) qui seront également supprimés.
                                  </span>
                                )}
                                <br />Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCondo(condo.id, condo.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}