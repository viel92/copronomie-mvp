'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea
} from '@copronomie/ui'
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { toast } from 'sonner'

type ContractType = 'property' | 'service_orders' | 'energy'

function NewContractForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contractType = (searchParams.get('type') || 'property') as ContractType

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    condo_id: '',
    contract_type: '',
    current_provider: '',
    contract_value: '',
    contract_start: '',
    contract_end: '',
    renewal_date: '',
    service_type: '',
    provider_name: '',
    monthly_cost: '',
    annual_cost: '',
    renewal_notice_days: '30',
    energy_type: '',
    contract_reference: '',
    annual_consumption: '',
    unit_price: '',
    fixed_cost: '',
  })

  const { data: condosData } = trpc.condos.getAll.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  const createPropertyMutation = trpc.contracts.property.create.useMutation({
    onSuccess: () => {
      toast.success('Contrat créé avec succès')
      router.push('/syndic/property-contracts')
    },
    onError: () => {
      toast.error('Erreur lors de la création du contrat')
    }
  })

  const createServiceOrderMutation = trpc.contracts.serviceOrders.create.useMutation({
    onSuccess: () => {
      toast.success('Ordre de service créé avec succès')
      router.push('/syndic/service-orders')
    },
    onError: () => {
      toast.error("Erreur lors de la création de l'ordre de service")
    }
  })

  const createEnergyMutation = trpc.contracts.energy.create.useMutation({
    onSuccess: () => {
      toast.success("Contrat d'énergie créé avec succès")
      router.push('/syndic/energy-contracts')
    },
    onError: () => {
      toast.error("Erreur lors de la création du contrat d'énergie")
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.condo_id) {
      toast.error('Veuillez remplir les champs obligatoires')
      return
    }

    if (contractType === 'property') {
      await createPropertyMutation.mutateAsync({
        condo_id: formData.condo_id,
        title: formData.title,
        description: formData.description || undefined,
        contract_type: formData.contract_type,
        current_provider: formData.current_provider || undefined,
        contract_value: formData.contract_value ? parseInt(formData.contract_value) : undefined,
        contract_start: formData.contract_start || undefined,
        contract_end: formData.contract_end || undefined,
        renewal_date: formData.renewal_date || undefined,
        renewal_notice_days: formData.renewal_notice_days ? parseInt(formData.renewal_notice_days) : undefined,
      })
    } else if (contractType === 'service_orders') {
      await createServiceOrderMutation.mutateAsync({
        condo_id: formData.condo_id,
        title: formData.title,
        description: formData.description || undefined,
        service_type: formData.service_type,
        provider_name: formData.provider_name || undefined,
        monthly_cost: formData.monthly_cost ? parseInt(formData.monthly_cost) : undefined,
        annual_cost: formData.annual_cost ? parseInt(formData.annual_cost) : undefined,
        contract_start: formData.contract_start || undefined,
        contract_end: formData.contract_end || undefined,
        renewal_notice_days: formData.renewal_notice_days ? parseInt(formData.renewal_notice_days) : undefined,
      })
    } else if (contractType === 'energy') {
      await createEnergyMutation.mutateAsync({
        condo_id: formData.condo_id,
        title: formData.title,
        description: formData.description || undefined,
        energy_type: formData.energy_type,
        current_provider: formData.current_provider || undefined,
        contract_reference: formData.contract_reference || undefined,
        annual_consumption: formData.annual_consumption ? parseInt(formData.annual_consumption) : undefined,
        unit_price: formData.unit_price ? parseFloat(formData.unit_price) : undefined,
        fixed_cost: formData.fixed_cost ? parseInt(formData.fixed_cost) : undefined,
        contract_start: formData.contract_start || undefined,
        contract_end: formData.contract_end || undefined,
        renewal_notice_days: formData.renewal_notice_days ? parseInt(formData.renewal_notice_days) : undefined,
      })
    }
  }

  const getPageTitle = () => {
    switch (contractType) {
      case 'property': return 'Nouveau Contrat de Copropriété'
      case 'service_orders': return 'Nouvel Ordre de Service'
      case 'energy': return "Nouveau Contrat d'Énergie"
      default: return 'Nouveau Contrat'
    }
  }

  if (user?.user?.role !== 'syndic') {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    )
  }

  const condos = condosData?.condos || []
  const isLoading = createPropertyMutation.isPending || createServiceOrderMutation.isPending || createEnergyMutation.isPending

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            Créez un nouveau contrat ou mettez-le directement en concurrence
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du contrat *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Contrat de nettoyage"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condo_id">Copropriété *</Label>
                <Select value={formData.condo_id} onValueChange={(value) => setFormData({ ...formData, condo_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une copropriété" />
                  </SelectTrigger>
                  <SelectContent>
                    {condos.map((condo) => (
                      <SelectItem key={condo.id} value={condo.id}>
                        {condo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description détaillée du contrat"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {contractType === 'property' && (
          <Card>
            <CardHeader>
              <CardTitle>Détails du contrat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contract_type">Type de contrat</Label>
                  <Select value={formData.contract_type} onValueChange={(value) => setFormData({ ...formData, contract_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de contrat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insurance">Assurance</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="cleaning">Nettoyage</SelectItem>
                      <SelectItem value="elevator">Ascenseur</SelectItem>
                      <SelectItem value="heating">Chauffage</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_provider">Prestataire actuel</Label>
                  <Input
                    id="current_provider"
                    value={formData.current_provider}
                    onChange={(e) => setFormData({ ...formData, current_provider: e.target.value })}
                    placeholder="Nom du prestataire"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract_value">Valeur du contrat (€)</Label>
                  <Input
                    id="contract_value"
                    type="number"
                    value={formData.contract_value}
                    onChange={(e) => setFormData({ ...formData, contract_value: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renewal_notice_days">Jours de préavis</Label>
                  <Input
                    id="renewal_notice_days"
                    type="number"
                    value={formData.renewal_notice_days}
                    onChange={(e) => setFormData({ ...formData, renewal_notice_days: e.target.value })}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract_start">Début du contrat</Label>
                  <Input
                    id="contract_start"
                    type="date"
                    value={formData.contract_start}
                    onChange={(e) => setFormData({ ...formData, contract_start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract_end">Fin du contrat</Label>
                  <Input
                    id="contract_end"
                    type="date"
                    value={formData.contract_end}
                    onChange={(e) => setFormData({ ...formData, contract_end: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="renewal_date">Date de renouvellement</Label>
                  <Input
                    id="renewal_date"
                    type="date"
                    value={formData.renewal_date}
                    onChange={(e) => setFormData({ ...formData, renewal_date: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {contractType === 'service_orders' && (
          <Card>
            <CardHeader>
              <CardTitle>Détails du service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service_type">Type de service</Label>
                  <Select value={formData.service_type} onValueChange={(value) => setFormData({ ...formData, service_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="cleaning">Nettoyage</SelectItem>
                      <SelectItem value="security">Sécurité</SelectItem>
                      <SelectItem value="gardening">Jardinage</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider_name">Prestataire</Label>
                  <Input
                    id="provider_name"
                    value={formData.provider_name}
                    onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                    placeholder="Nom du prestataire"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly_cost">Coût mensuel (€)</Label>
                  <Input
                    id="monthly_cost"
                    type="number"
                    value={formData.monthly_cost}
                    onChange={(e) => setFormData({ ...formData, monthly_cost: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual_cost">Coût annuel (€)</Label>
                  <Input
                    id="annual_cost"
                    type="number"
                    value={formData.annual_cost}
                    onChange={(e) => setFormData({ ...formData, annual_cost: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract_start">Début du contrat</Label>
                  <Input
                    id="contract_start"
                    type="date"
                    value={formData.contract_start}
                    onChange={(e) => setFormData({ ...formData, contract_start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract_end">Fin du contrat</Label>
                  <Input
                    id="contract_end"
                    type="date"
                    value={formData.contract_end}
                    onChange={(e) => setFormData({ ...formData, contract_end: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {contractType === 'energy' && (
          <Card>
            <CardHeader>
              <CardTitle>Détails du contrat d'énergie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="energy_type">Type d'énergie</Label>
                  <Select value={formData.energy_type} onValueChange={(value) => setFormData({ ...formData, energy_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type d'énergie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electricity">Électricité</SelectItem>
                      <SelectItem value="gas">Gaz</SelectItem>
                      <SelectItem value="water">Eau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_provider">Fournisseur actuel</Label>
                  <Input
                    id="current_provider"
                    value={formData.current_provider}
                    onChange={(e) => setFormData({ ...formData, current_provider: e.target.value })}
                    placeholder="Nom du fournisseur"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract_reference">Référence du contrat</Label>
                  <Input
                    id="contract_reference"
                    value={formData.contract_reference}
                    onChange={(e) => setFormData({ ...formData, contract_reference: e.target.value })}
                    placeholder="Numéro de contrat"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annual_consumption">Consommation annuelle</Label>
                  <Input
                    id="annual_consumption"
                    type="number"
                    value={formData.annual_consumption}
                    onChange={(e) => setFormData({ ...formData, annual_consumption: e.target.value })}
                    placeholder={formData.energy_type === 'electricity' ? 'kWh' : 'm³'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit_price">Prix unitaire (€)</Label>
                  <Input
                    id="unit_price"
                    type="number"
                    step="0.0001"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                    placeholder={formData.energy_type === 'electricity' ? '€/kWh' : '€/m³'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fixed_cost">Coût fixe (€)</Label>
                  <Input
                    id="fixed_cost"
                    type="number"
                    value={formData.fixed_cost}
                    onChange={(e) => setFormData({ ...formData, fixed_cost: e.target.value })}
                    placeholder="Abonnement mensuel/annuel"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract_start">Début du contrat</Label>
                  <Input
                    id="contract_start"
                    type="date"
                    value={formData.contract_start}
                    onChange={(e) => setFormData({ ...formData, contract_start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contract_end">Fin du contrat</Label>
                  <Input
                    id="contract_end"
                    type="date"
                    value={formData.contract_end}
                    onChange={(e) => setFormData({ ...formData, contract_end: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function NewContractPage() {
  return (
    <Suspense fallback={<div className="p-8">Chargement...</div>}>
      <NewContractForm />
    </Suspense>
  )
}