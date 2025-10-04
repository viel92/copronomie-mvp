'use client'

import { trpc } from '@/lib/trpc'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@copronomie/ui'
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const utils = trpc.useUtils()

  const [isLoading, setIsLoading] = useState(false)

  const { data: projectData, isLoading: projectLoading } = trpc.projects.getById.useQuery({ id: projectId })
  const { data: condosData } = trpc.condos.getAll.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  const updateProjectMutation = trpc.projects.update.useMutation({
    onSuccess: () => {
      setIsLoading(false)
      // Invalider le cache pour rafraîchir
      utils.projects.getAll.invalidate()
      utils.projects.getById.invalidate({ id: projectId })
      toast.success('Projet mis à jour avec succès')
      router.push(`/syndic/projects/${projectId}`)
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour du projet')
      setIsLoading(false)
    }
  })

  const publishProjectMutation = trpc.projects.publish.useMutation({
    onSuccess: () => {
      setIsLoading(false)
      // Invalider le cache pour rafraîchir
      utils.projects.getAll.invalidate()
      utils.projects.getById.invalidate({ id: projectId })
      toast.success('Projet publié avec succès')
      router.push(`/syndic/projects/${projectId}`)
    },
    onError: () => {
      toast.error('Erreur lors de la publication du projet')
      setIsLoading(false)
    }
  })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    condo_id: '',
    budget_min: '',
    budget_max: '',
    deadline: '',
    status: 'draft' as 'draft' | 'published' | 'analyzing' | 'awarded' | 'completed'
  })

  const project = projectData?.project

  // Initialize form data when project loads
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        type: project.type || '',
        condo_id: project.condo_id || '',
        budget_min: project.budget_min?.toString() || '',
        budget_max: project.budget_max?.toString() || '',
        deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
        status: project.status || 'draft'
      })
    }
  }, [project])

  if (user?.user?.role !== 'syndic') {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    )
  }

  if (projectLoading) {
    return (
      <div className="space-y-6 p-8">
        <div className="space-y-2">
          <div className="h-9 w-1/3 bg-muted animate-pulse rounded" />
          <div className="h-5 w-1/2 bg-muted animate-pulse rounded" />
        </div>
        <div className="border rounded-lg p-6 space-y-6">
          <div className="h-6 w-1/4 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
              <div className="h-10 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
            <div className="h-24 w-full bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/syndic/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Projet introuvable</h1>
        </div>
      </div>
    )
  }

  // Only allow editing draft projects
  if (project.status !== 'draft') {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/syndic/projects/${projectId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Modification impossible</h1>
            <p className="text-muted-foreground mt-1">
              Seuls les projets en brouillon peuvent être modifiés
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/syndic/projects/${projectId}`)}>
          Voir le projet
        </Button>
      </div>
    )
  }

  const condos = condosData?.condos || []

  const handleSubmit = async (e: React.FormEvent, shouldPublish: boolean = false) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation - only validate editable fields
    if (!formData.title.trim()) {
      toast.error('Le titre du projet est requis')
      setIsLoading(false)
      return
    }

    try {
      if (shouldPublish) {
        // First update, then publish
        await updateProjectMutation.mutateAsync({
          id: projectId,
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          deadline: formData.deadline || undefined,
        })
        await publishProjectMutation.mutateAsync({ id: projectId })
      } else {
        // Just update as draft
        await updateProjectMutation.mutateAsync({
          id: projectId,
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          deadline: formData.deadline || undefined,
          status: 'draft'
        })
      }
    } catch (error) {
      // Errors are handled by mutations
      console.error('❌ Mutation error:', error)
      setIsLoading(false)
    }
  }

  const projectTypes = [
    { value: 'roofing', label: 'Toiture' },
    { value: 'heating', label: 'Chauffage' },
    { value: 'elevator', label: 'Ascenseur' },
    { value: 'painting', label: 'Peinture' },
    { value: 'facade', label: 'Façade' },
    { value: 'plumbing', label: 'Plomberie' },
    { value: 'electrical', label: 'Électricité' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/syndic/projects/${projectId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Modifier le projet</h1>
          <p className="text-muted-foreground mt-1">
            Modifiez les informations de votre projet
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du projet *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Rénovation toiture - Résidence Les Jardins"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de travaux *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  required
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Le type de travaux ne peut pas être modifié après création
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description du projet</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez les travaux à réaliser, les spécifications techniques, les contraintes..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localisation et budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="condo_id">Copropriété concernée *</Label>
              <Select
                value={formData.condo_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, condo_id: value }))}
                required
                disabled
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la copropriété" />
                </SelectTrigger>
                <SelectContent>
                  {condos.map(condo => (
                    <SelectItem key={condo.id} value={condo.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{condo.name}</span>
                        {condo.address && (
                          <span className="text-xs text-muted-foreground">{condo.address}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                La copropriété ne peut pas être modifiée après création
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget_min">Budget minimum (€)</Label>
                <Input
                  id="budget_min"
                  type="number"
                  value={formData.budget_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_min: e.target.value }))}
                  placeholder="25000"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Le budget ne peut pas être modifié après création
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_max">Budget maximum (€)</Label>
                <Input
                  id="budget_max"
                  type="number"
                  value={formData.budget_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_max: e.target.value }))}
                  placeholder="35000"
                  disabled
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Date limite de soumission</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            <p><strong>Sauvegarder :</strong> Le projet restera en brouillon</p>
            <p><strong>Publier :</strong> Le projet sera immédiatement visible aux entreprises</p>
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/syndic/projects/${projectId}`)}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              variant="outline"
              disabled={isLoading}
              className="bg-gray-50 hover:bg-gray-100"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Sauvegarder
            </Button>

            <Button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Publier le projet
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
