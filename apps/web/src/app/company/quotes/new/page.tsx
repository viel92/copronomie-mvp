'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
  Badge
} from '@copronomie/ui'
import {
  ArrowLeft,
  Save,
  Loader2,
  FileText,
  Euro,
  Clock,
  Building
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function NewQuotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get('projectId')

  const [formData, setFormData] = useState({
    amount: '',
    delivery_days: '',
    details: ''
  })

  const { data: projectData, isLoading: projectLoading } = trpc.projects.getById.useQuery(
    { id: projectId || '' },
    { enabled: !!projectId }
  )

  const { data: condosData } = trpc.condos.getAll.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  const createQuoteMutation = trpc.quotes.create.useMutation({
    onSuccess: () => {
      toast.success('Devis soumis avec succès')
      router.push('/company/dashboard')
    },
    onError: () => {
      toast.error('Erreur lors de la soumission du devis')
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!projectId) {
      toast.error('Projet non spécifié')
      return
    }

    if (!formData.amount || !formData.delivery_days) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (!user?.user?.company_id) {
      toast.error('Identifiant entreprise manquant')
      return
    }

    await createQuoteMutation.mutateAsync({
      project_id: projectId,
      company_id: user.user.company_id,
      amount: parseFloat(formData.amount),
      details: formData.details ? {
        delivery_days: parseInt(formData.delivery_days),
        description: formData.details
      } : undefined
    })
  }

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (user?.user?.role !== 'company') {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    )
  }

  if (!projectId || !projectData?.project) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/company/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Projet introuvable</h1>
        </div>
      </div>
    )
  }

  const project = projectData.project
  const condos = condosData?.condos || []
  const condo = condos.find(c => c.id === project.condo_id)

  const getProjectType = (type: string) => {
    const types: Record<string, string> = {
      roofing: 'Toiture',
      heating: 'Chauffage',
      plumbing: 'Plomberie',
      electrical: 'Électricité',
      painting: 'Peinture',
      masonry: 'Maçonnerie',
      carpentry: 'Menuiserie',
      locksmith: 'Serrurerie',
      glazing: 'Vitrerie',
      other: 'Autre'
    }
    return types[type] || type
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push('/company/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Soumettre un devis</h1>
          <p className="text-muted-foreground mt-1">
            Proposez votre offre pour ce projet
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Détails du projet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <Badge variant="secondary">{getProjectType(project.type)}</Badge>
              </div>
              <p className="text-muted-foreground">
                {project.description || 'Pas de description'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">{condo?.name || 'Copropriété'}</p>
                  <p className="text-muted-foreground text-xs">{condo?.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">Budget indicatif</p>
                  <p className="text-muted-foreground text-xs">
                    {project.budget_min?.toLocaleString()}€ - {project.budget_max?.toLocaleString()}€
                  </p>
                </div>
              </div>

              {project.deadline && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Échéance souhaitée</p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(project.deadline).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Votre proposition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant du devis (€) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Ex: 15000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_days">Délai de réalisation (jours) *</Label>
                <Input
                  id="delivery_days"
                  type="number"
                  value={formData.delivery_days}
                  onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                  placeholder="Ex: 30"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Détails de votre offre</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Décrivez votre offre, les matériaux utilisés, les garanties, etc."
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Plus votre offre est détaillée, plus vous avez de chances d&apos;être retenu
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={createQuoteMutation.isPending}>
                {createQuoteMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Soumettre le devis
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}