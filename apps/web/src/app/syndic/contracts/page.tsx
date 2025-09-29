'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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
import { Plus, Search, Edit, Trash2, FileText, Zap, Wrench, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { toast } from 'sonner'

function ContractsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('type') || 'property')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [condoFilter, setCondoFilter] = useState('all')

  const { data: propertyData, isLoading: propertyLoading } = trpc.contracts.property.getAll.useQuery()
  const { data: energyData, isLoading: energyLoading } = trpc.contracts.energy.getAll.useQuery()
  const { data: serviceData, isLoading: serviceLoading } = trpc.contracts.serviceOrders.getAll.useQuery()
  const { data: condosData } = trpc.condos.getAll.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  const deletePropertyMutation = trpc.contracts.property.delete.useMutation({
    onSuccess: () => toast.success('Contrat supprimé')
  })

  const deleteEnergyMutation = trpc.contracts.energy.delete.useMutation({
    onSuccess: () => toast.success('Contrat supprimé')
  })

  const deleteServiceMutation = trpc.contracts.serviceOrders.delete.useMutation({
    onSuccess: () => toast.success('Contrat supprimé')
  })

  useEffect(() => {
    const type = searchParams.get('type')
    if (type && ['property', 'energy', 'service'].includes(type)) {
      setActiveTab(type)
    }
  }, [searchParams])

  if (user?.user?.role !== 'syndic') {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    )
  }

  const condos = condosData?.condos || []
  const propertyContracts = propertyData?.contracts || []
  const energyContracts = energyData?.contracts || []
  const serviceContracts = serviceData?.orders || []

  const filterContracts = (contracts: any[]) => {
    return contracts.filter((contract) => {
      const matchesSearch =
        contract.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.current_provider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.provider_name?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
      const matchesCondo = condoFilter === 'all' || contract.condo_id === condoFilter
      return matchesSearch && matchesStatus && matchesCondo
    })
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, string> = {
      active: 'bg-green-500/10 text-green-500',
      pending: 'bg-yellow-500/10 text-yellow-500',
      expired: 'bg-red-500/10 text-red-500',
      cancelled: 'bg-gray-500/10 text-gray-500'
    }
    return <Badge className={variants[status] || 'bg-gray-500/10'}>{status}</Badge>
  }

  const ContractCard = ({ contract, type }: { contract: any; type: string }) => {
    const condo = condos.find(c => c.id === contract.condo_id)
    const deleteMutation = type === 'property' ? deletePropertyMutation :
                          type === 'energy' ? deleteEnergyMutation :
                          deleteServiceMutation

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{contract.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{condo?.name}</p>
              <p className="text-sm text-muted-foreground">{contract.current_provider || contract.provider_name}</p>
            </div>
            <StatusBadge status={contract.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date début:</span>
              <span>{new Date(contract.start_date).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date fin:</span>
              <span>{new Date(contract.end_date).toLocaleDateString('fr-FR')}</span>
            </div>
            {contract.monthly_cost && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Coût mensuel:</span>
                <span className="font-medium">{contract.monthly_cost}€</span>
              </div>
            )}
            {contract.energy_type && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span>{contract.energy_type}</span>
              </div>
            )}
            {contract.service_type && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span>{contract.service_type}</span>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => router.push(`/syndic/contracts/${type}/${contract.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer ce contrat ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteMutation.mutate({ id: contract.id })}>
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
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contrats</h1>
          <p className="text-muted-foreground">Gérez vos contrats de copropriété</p>
        </div>
        <Button onClick={() => router.push('/syndic/contracts/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau contrat
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un contrat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="expired">Expiré</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={condoFilter} onValueChange={setCondoFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Copropriété" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les copros</SelectItem>
            {condos.map((condo) => (
              <SelectItem key={condo.id} value={condo.id}>{condo.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="property" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Immobilier
          </TabsTrigger>
          <TabsTrigger value="energy" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Énergie
          </TabsTrigger>
          <TabsTrigger value="service" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="property" className="space-y-4">
          {propertyLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filterContracts(propertyContracts).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun contrat immobilier</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filterContracts(propertyContracts).map((contract) => (
                <ContractCard key={contract.id} contract={contract} type="property" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="energy" className="space-y-4">
          {energyLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filterContracts(energyContracts).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun contrat d'énergie</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filterContracts(energyContracts).map((contract) => (
                <ContractCard key={contract.id} contract={contract} type="energy" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="service" className="space-y-4">
          {serviceLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filterContracts(serviceContracts).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucun contrat de service</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filterContracts(serviceContracts).map((contract) => (
                <ContractCard key={contract.id} contract={contract} type="service" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ContractsPage() {
  return (
    <Suspense fallback={<div className="p-8">Chargement...</div>}>
      <ContractsContent />
    </Suspense>
  )
}