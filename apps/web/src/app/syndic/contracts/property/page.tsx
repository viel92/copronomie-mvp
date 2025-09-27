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
import { Plus, Search, Edit, Trash2, AlertCircle, Send, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function PropertyContractsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [condoFilter, setCondoFilter] = useState('all')
  const [contractTypeFilter, setContractTypeFilter] = useState('all')

  const { data: contractsData, isLoading: contractsLoading } = trpc.contracts.getPropertyContracts.useQuery()
  const { data: condosData } = trpc.condos.getAll.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  const deleteContractMutation = trpc.contracts.deletePropertyContract.useMutation({
    onSuccess: () => {
      toast.success('Contrat supprimé avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la suppression du contrat')
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

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.current_provider?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
    const matchesCondo = condoFilter === 'all' || contract.condo_id === condoFilter
    const matchesContractType = contractTypeFilter === 'all' || contract.contract_type === contractTypeFilter

    return matchesSearch && matchesStatus && matchesCondo && matchesContractType
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

  const isRenewalRequired = (contract: any) => {
    if (!contract.renewal_date) return false
    const renewalDate = new Date(contract.renewal_date)
    const today = new Date()
    const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilRenewal <= 30
  }

  const handleDeleteContract = async (contractId: string) => {
    await deleteContractMutation.mutateAsync({ id: contractId })
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contrats de Copropriété</h1>
          <p className="text-muted-foreground">
            Gérez les contrats de votre copropriété à mettre en concurrence
          </p>
        </div>
        <Button onClick={() => router.push('/syndic/contracts/property/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Contrat
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
                  placeholder="Rechercher un contrat..."
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
            <Select value={contractTypeFilter} onValueChange={setContractTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="insurance">Assurance</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="cleaning">Nettoyage</SelectItem>
                <SelectItem value="elevator">Ascenseur</SelectItem>
                <SelectItem value="heating">Chauffage</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
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
                ? 'Aucun contrat de copropriété trouvé'
                : 'Aucun contrat ne correspond aux filtres sélectionnés'}
            </p>
            {contracts.length === 0 && (
              <Button onClick={() => router.push('/syndic/contracts/property/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Créer votre premier contrat
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredContracts.map((contract) => {
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
                        <Badge variant="outline">
                          {contract.contract_type}
                        </Badge>
                        {isRenewalRequired(contract) && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            À renouveler
                          </Badge>
                        )}
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
                          Prestataire actuel: {contract.current_provider}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => {
                          toast.info('Fonctionnalité de mise en concurrence à venir')
                        }}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/syndic/contracts/property/${contract.id}/edit`)}
                      >
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
                            <AlertDialogTitle>Supprimer le contrat</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer ce contrat ? Cette action est irréversible.
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
                      <p className="font-medium">Valeur du contrat</p>
                      <p className="text-muted-foreground">
                        {contract.contract_value ? `${contract.contract_value.toLocaleString()}€` : 'Non défini'}
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
                    <div>
                      <p className="font-medium">Fin du contrat</p>
                      <p className="text-muted-foreground">
                        {contract.contract_end
                          ? new Date(contract.contract_end).toLocaleDateString('fr-FR')
                          : 'Non défini'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Date de renouvellement</p>
                      <p className="text-muted-foreground">
                        {contract.renewal_date
                          ? new Date(contract.renewal_date).toLocaleDateString('fr-FR')
                          : 'Non défini'}
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