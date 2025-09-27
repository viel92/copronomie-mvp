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
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { data: condosData } = trpc.condos.getAll.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  const createProjectMutation = trpc.projects.create.useMutation({
    onSuccess: () => {
      setIsLoading(false)
      router.push('/syndic/projects')
    },
    onError: () => {
      toast.error('Erreur lors de la création du projet')
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
    deadline: ''
  })

  if (user?.user?.role !== 'syndic') {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    )
  }

  const condos = condosData?.condos || []

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'draft') => {
    e.preventDefault()
    setIsLoading(true)

    const successMessage = status === 'draft'
      ? 'Le projet a été sauvegardé en brouillon.'
      : 'Le projet a été publié et est maintenant visible par les entreprises.'

    await createProjectMutation.mutateAsync({
      title: formData.title,
      description: formData.description,
      type: formData.type as any,
      condo_id: formData.condo_id,
      budget_min: parseInt(formData.budget_min),
      budget_max: parseInt(formData.budget_max),
      deadline: formData.deadline || undefined,
      status
    })

    toast.success('Projet créé avec succès', {
      description: successMessage
    })
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
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push('/syndic/projects')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nouveau Projet</h1>
          <p className="text-muted-foreground mt-1">
            Créez un nouveau projet de travaux pour une copropriété
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, 'draft')} className="space-y-6">
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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la copropriété" />
                </SelectTrigger>
                <SelectContent>
                  {condos.map(condo => (
                    <SelectItem key={condo.id} value={condo.id}>
                      {condo.name} {condo.address && `- ${condo.address}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget_min">Budget minimum (€) *</Label>
                <Input
                  id="budget_min"
                  type="number"
                  value={formData.budget_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_min: e.target.value }))}
                  placeholder="25000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_max">Budget maximum (€) *</Label>
                <Input
                  id="budget_max"
                  type="number"
                  value={formData.budget_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget_max: e.target.value }))}
                  placeholder="35000"
                  required
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

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/syndic/projects')}
          >
            Annuler
          </Button>

          <Button
            type="submit"
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Sauvegarder brouillon
          </Button>

          <Button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Eye className="h-4 w-4 mr-2" />
            )}
            Publier le projet
          </Button>
        </div>
      </form>
    </div>
  )
}