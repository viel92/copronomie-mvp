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
import { ArrowLeft, Save, Eye, Loader2, Plus } from 'lucide-react'
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

  const [showNewCondoForm, setShowNewCondoForm] = useState(false)
  const [newCondoData, setNewCondoData] = useState({
    name: '',
    address: '',
    units_count: '',
    description: ''
  })

  const createCondoMutation = trpc.condos.create.useMutation({
    onSuccess: (data) => {
      toast.success('Copropriété créée avec succès')
      setFormData(prev => ({ ...prev, condo_id: data.condo.id }))
      setShowNewCondoForm(false)
      setNewCondoData({ name: '', address: '', units_count: '', description: '' })
    },
    onError: () => {
      toast.error('Erreur lors de la création de la copropriété')
    }
  })

  // Debug: Log de la structure de l'utilisateur
  console.log('User data:', user)

  if (!user?.user || user?.user?.role !== 'syndic') {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Accès non autorisé - Role: {user?.user?.role}</p>
        <pre className="mt-4 text-xs">{JSON.stringify(user, null, 2)}</pre>
      </div>
    )
  }

  const condos = condosData?.condos || []

  const handleCreateCondo = async () => {
    if (!newCondoData.name || !newCondoData.address) {
      toast.error('Veuillez remplir au minimum le nom et l\'adresse de la copropriété')
      return
    }

    await createCondoMutation.mutateAsync({
      name: newCondoData.name,
      address: newCondoData.address,
      units_count: newCondoData.units_count ? parseInt(newCondoData.units_count) : undefined
    })
  }

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'draft') => {
    e.preventDefault()
    setIsLoading(true)

    // Validation supplémentaire
    if (!formData.title.trim()) {
      toast.error('Le titre du projet est requis')
      setIsLoading(false)
      return
    }

    if (!formData.type) {
      toast.error('Le type de travaux est requis')
      setIsLoading(false)
      return
    }

    if (!formData.condo_id) {
      toast.error('Vous devez sélectionner une copropriété')
      setIsLoading(false)
      return
    }

    const budgetMin = parseInt(formData.budget_min)
    const budgetMax = parseInt(formData.budget_max)

    if (isNaN(budgetMin) || budgetMin <= 0) {
      toast.error('Le budget minimum doit être un nombre positif')
      setIsLoading(false)
      return
    }

    if (isNaN(budgetMax) || budgetMax <= 0) {
      toast.error('Le budget maximum doit être un nombre positif')
      setIsLoading(false)
      return
    }

    if (budgetMax < budgetMin) {
      toast.error('Le budget maximum doit être supérieur au budget minimum')
      setIsLoading(false)
      return
    }

    try {
      const successMessage = status === 'draft'
        ? 'Le projet a été sauvegardé en brouillon.'
        : 'Le projet a été publié et est maintenant visible par les entreprises.'

      await createProjectMutation.mutateAsync({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type as any,
        condo_id: formData.condo_id,
        budget_min: budgetMin,
        budget_max: budgetMax,
        deadline: formData.deadline || undefined,
        status
      })

      toast.success('Projet créé avec succès', {
        description: successMessage
      })
    } catch (error) {
      // L'erreur est déjà gérée par la mutation
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
              <div className="flex items-center justify-between">
                <Label htmlFor="condo_id">Copropriété concernée *</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/syndic/condos/new')}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Créer une copropriété
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewCondoForm(!showNewCondoForm)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Ajout rapide
                  </Button>
                </div>
              </div>
              <Select
                value={formData.condo_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, condo_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la copropriété" />
                </SelectTrigger>
                <SelectContent>
                  {condos.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <p className="text-sm">Aucune copropriété disponible</p>
                      <p className="text-xs mt-1">Créez votre première copropriété pour continuer</p>
                    </div>
                  ) : (
                    condos.map(condo => (
                      <SelectItem key={condo.id} value={condo.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{condo.name}</span>
                          {condo.address && (
                            <span className="text-xs text-muted-foreground">{condo.address}</span>
                          )}
                          {condo.units_count && (
                            <span className="text-xs text-muted-foreground">{condo.units_count} lots</span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {condos.length === 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Aucune copropriété trouvée.</strong> Vous devez d'abord créer une copropriété pour pouvoir créer un projet.
                  </p>
                </div>
              )}

              {showNewCondoForm && (
                <Card className="mt-4 border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Ajout rapide d'une copropriété
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Pour un ajout complet avec recherche dans le registre national, utilisez le bouton "Créer une copropriété"
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new_condo_name">Nom de la copropriété *</Label>
                        <Input
                          id="new_condo_name"
                          value={newCondoData.name}
                          onChange={(e) => setNewCondoData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Ex: Résidence Les Jardins"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new_condo_address">Adresse complète *</Label>
                        <Input
                          id="new_condo_address"
                          value={newCondoData.address}
                          onChange={(e) => setNewCondoData(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="123 rue de la République, 75001 Paris"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new_condo_units">Nombre de lots *</Label>
                        <Input
                          id="new_condo_units"
                          type="number"
                          value={newCondoData.units_count}
                          onChange={(e) => setNewCondoData(prev => ({ ...prev, units_count: e.target.value }))}
                          placeholder="25"
                          min="1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new_condo_description">Description (optionnel)</Label>
                        <Input
                          id="new_condo_description"
                          value={newCondoData.description}
                          onChange={(e) => setNewCondoData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description de la copropriété"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button
                        type="button"
                        onClick={handleCreateCondo}
                        disabled={createCondoMutation.isPending}
                        size="sm"
                      >
                        {createCondoMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        Créer et sélectionner
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowNewCondoForm(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
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

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            <p><strong>Brouillon :</strong> Le projet sera sauvegardé mais pas visible par les entreprises</p>
            <p><strong>Publier :</strong> Le projet sera immédiatement visible et les entreprises pourront soumissionner</p>
          </div>
          <div className="flex gap-3">
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
              disabled={isLoading || !formData.condo_id}
              className="bg-gray-50 hover:bg-gray-100"
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
              disabled={isLoading || !formData.condo_id}
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