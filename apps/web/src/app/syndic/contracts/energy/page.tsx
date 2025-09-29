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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
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
import { Plus, Search, Eye, Edit, Trash2, Zap, Flame, Droplets, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function EnergyContractsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [condoFilter, setCondoFilter] = useState('all')
  const [energyTypeFilter, setEnergyTypeFilter] = useState('all')

  const { data: contractsData, isLoading: contractsLoading } = trpc.contracts.energy.getAll.useQuery()
  const { data: condosData } = trpc.condos.getAll.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  const deleteContractMutation = trpc.contracts.energy.delete.useMutation({
    onSuccess: () => {
      toast.success("Contrat d'énergie supprimé avec succès")
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du contrat d'énergie")
    }
  })

  if (contractsLoading) {
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

  const contracts = contractsData?.contracts || []
  const condos = condosData?.condos || []

  const filteredContracts = contracts.filter((contract: any) => {
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.current_provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.contract_reference?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
    const matchesCondo = condoFilter === 'all' || contract.condo_id === condoFilter
    const matchesEnergyType = energyTypeFilter === 'all' || contract.energy_type === energyTypeFilter

    return matchesSearch && matchesStatus && matchesCondo && matchesEnergyType
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      active: 'default',
      expiring: 'destructive',
      expired: 'destructive',
      renewal_required: 'destructive'
    }
    return colors[status] || 'secondary'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Actif',
      expiring: 'Bientôt expiré',
      expired: 'Expiré',
      renewal_required: 'Renouvellement requis'
    }
    return labels[status] || status
  }

  const getEnergyIcon = (energyType: string) => {
    switch (energyType) {
      case 'electricity': return <Zap className="h-4 w-4" />
      case 'gas': return <Flame className="h-4 w-4" />
      case 'water': return <Droplets className="h-4 w-4" />
      default: return null
    }
  }

  const getEnergyTypeLabel = (energyType: string) => {
    const labels: Record<string, string> = {
      electricity: 'Électricité',
      gas: 'Gaz',
      water: 'Eau'
    }
    return labels[energyType] || energyType
  }

  const handleDeleteContract = async (contractId: string) => {
    await deleteContractMutation.mutateAsync({ id: contractId })
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contrats d&apos;Énergie</h1>
          <p className="text-muted-foreground">
            Gérez vos contrats d&apos;énergie (gaz, électricité, eau)
          </p>
        </div>
        <Button onClick={() => router.push('/syndic/contracts/energy/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Contrat d&apos;Énergie
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un contrat d'énergie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="expiring">Bientôt expiré</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
                <SelectItem value="renewal_required">Renouvellement requis</SelectItem>
              </SelectContent>
            </Select>
            <Select value={energyTypeFilter} onValueChange={setEnergyTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type d'énergie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="electricity">Électricité</SelectItem>
                <SelectItem value="gas">Gaz</SelectItem>
                <SelectItem value="water">Eau</SelectItem>
              </SelectContent>
            </Select>
            <Select value={condoFilter} onValueChange={setCondoFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Copropriété" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les copropriétés</SelectItem>
                {condos.map((condo) => (
                  <SelectItem key={condo.id} value={condo.id}>
                    {condo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredContracts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {contracts.length === 0
                ? "Aucun contrat d'énergie trouvé"
                : 'Aucun contrat ne correspond aux filtres sélectionnés'}
            </p>
            {contracts.length === 0 && (
              <Button onClick={() => router.push('/syndic/contracts/energy/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Créer votre premier contrat d&apos;énergie
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredContracts.map((contract: any) => {
            const condo = condos.find(c => c.id === contract.condo_id)

            return (
              <Card key={contract.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {contract.title}
                        <Badge variant={getStatusColor(contract.status || 'active')}>
                          {getStatusLabel(contract.status || 'active')}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getEnergyIcon(contract.energy_type || 'electricity')}
                          {getEnergyTypeLabel(contract.energy_type || 'electricity')}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {contract.description}
                      </CardDescription>
                      {condo && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {condo.name} - {condo.address}
                        </p>
                      )}
                      {contract.current_provider && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Fournisseur: {contract.current_provider}
                        </p>
                      )}
                      {contract.contract_reference && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Référence: {contract.contract_reference}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le contrat d&apos;énergie</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer ce contrat d&apos;énergie ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteContract(contract.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Consommation annuelle</p>
                      <p className="text-muted-foreground">
                        {contract.annual_consumption
                          ? `${contract.annual_consumption.toLocaleString()} ${contract.energy_type === 'electricity' ? 'kWh' : 'm³'}`
                          : 'Non défini'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Prix unitaire</p>
                      <p className="text-muted-foreground">
                        {contract.unit_price
                          ? `${contract.unit_price}€/${contract.energy_type === 'electricity' ? 'kWh' : 'm³'}`
                          : 'Non défini'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Coût fixe</p>
                      <p className="text-muted-foreground">
                        {contract.fixed_cost ? `${contract.fixed_cost.toLocaleString()}€` : 'Non défini'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Début du contrat</p>
                      <p className="text-muted-foreground">
                        {contract.contract_start
                          ? new Date(contract.contract_start).toLocaleDateString('fr-FR')
                          : 'Non défini'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                    <div>
                      <p className="font-medium">Fin du contrat</p>
                      <p className="text-muted-foreground">
                        {contract.contract_end
                          ? new Date(contract.contract_end).toLocaleDateString('fr-FR')
                          : 'Non défini'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Coût annuel estimé</p>
                      <p className="text-muted-foreground">
                        {contract.annual_consumption && contract.unit_price
                          ? `${(contract.annual_consumption * parseFloat(contract.unit_price.toString()) + (contract.fixed_cost || 0)).toLocaleString()}€`
                          : 'Non calculable'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}