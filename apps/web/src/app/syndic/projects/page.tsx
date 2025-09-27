'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Euro,
  MapPin,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function SyndicProjectsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [condoFilter, setCondoFilter] = useState('all')
  const [deletingProject, setDeletingProject] = useState<string | null>(null)

  const { data: projectsData, isLoading: projectsLoading } = trpc.projects.getAll.useQuery()
  const { data: condosData, isLoading: condosLoading } = trpc.condos.getAll.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  const deleteProjectMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      toast.success('Projet supprimé avec succès')
      setDeletingProject(null)
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du projet')
      setDeletingProject(null)
    }
  })

  const publishProjectMutation = trpc.projects.publish.useMutation({
    onSuccess: () => {
      toast.success('Projet publié avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la publication du projet')
    }
  })

  const isLoading = projectsLoading || condosLoading

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

  const projects = projectsData?.projects || []
  const condos = condosData?.condos || []

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesCondo = condoFilter === 'all' || project.condo_id === condoFilter
    return matchesSearch && matchesStatus && matchesCondo
  })

  const handleDeleteProject = async (projectId: string) => {
    setDeletingProject(projectId)
    await deleteProjectMutation.mutateAsync({ id: projectId })
  }

  const handlePublishProject = async (projectId: string) => {
    await publishProjectMutation.mutateAsync({ id: projectId })
  }

  const getStatusColor = (status: string) => {
    const styles = {
      draft: 'bg-muted text-muted-foreground',
      published: 'bg-primary text-primary-foreground',
      analyzing: 'bg-yellow-100 text-yellow-800',
      awarded: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800'
    }
    return styles[status as keyof typeof styles] || styles.draft
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      draft: 'Brouillon',
      published: 'Publié',
      analyzing: 'En analyse',
      awarded: 'Attribué',
      completed: 'Terminé'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getTypeLabel = (type: string) => {
    const types = {
      roofing: 'Toiture',
      heating: 'Chauffage',
      elevator: 'Ascenseur',
      painting: 'Peinture',
      facade: 'Façade',
      plumbing: 'Plomberie',
      electrical: 'Électricité'
    }
    return types[type as keyof typeof types] || type
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Projets</h1>
          <p className="text-muted-foreground mt-1">
            Créez, gérez et suivez tous vos projets de travaux
          </p>
        </div>
        <Button
          variant="hero"
          onClick={() => router.push('/syndic/projects/new')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={condoFilter} onValueChange={setCondoFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Copropriété" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les copropriétés</SelectItem>
                  {condos.map(condo => (
                    <SelectItem key={condo.id} value={condo.id}>
                      {condo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="analyzing">En analyse</SelectItem>
                  <SelectItem value="awarded">Attribué</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Aucun projet trouvé</h3>
                  <p className="text-muted-foreground">
                    {projects.length === 0
                      ? 'Créez votre premier projet pour commencer'
                      : 'Aucun projet ne correspond à vos critères de recherche'
                    }
                  </p>
                </div>
                {projects.length === 0 && (
                  <Button
                    variant="outline"
                    onClick={() => router.push('/syndic/projects/new')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un projet
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => {
            const condo = condos.find(c => c.id === project.condo_id)

            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                        <Badge className={getStatusColor(project.status || 'draft')}>
                          {getStatusLabel(project.status || 'draft')}
                        </Badge>
                        {project.type && (
                          <Badge variant="outline">
                            {getTypeLabel(project.type)}
                          </Badge>
                        )}
                      </div>

                      {project.description && (
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {project.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {condo && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{condo.name}</span>
                          </div>
                        )}

                        {(project.budget_min || project.budget_max) && (
                          <div className="flex items-center gap-1">
                            <Euro className="h-4 w-4" />
                            <span>
                              {project.budget_min?.toLocaleString()}€ - {project.budget_max?.toLocaleString()}€
                            </span>
                          </div>
                        )}

                        {project.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(project.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/syndic/projects/${project.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/syndic/projects/${project.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            disabled={deletingProject === project.id}
                          >
                            {deletingProject === project.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le projet</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer le projet "{project.title}" ?
                              Cette action est irréversible et supprimera également tous les devis associés.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProject(project.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      Créé le {new Date(project.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2">
                      {project.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePublishProject(project.id)}
                        >
                          Publier
                        </Button>
                      )}
                      {project.status === 'published' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/syndic/projects/${project.id}/quotes`)}
                        >
                          Voir les devis
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => router.push(`/syndic/projects/${project.id}`)}
                      >
                        Détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}