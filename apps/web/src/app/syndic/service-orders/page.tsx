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
import { Plus, Search, Eye, Edit, Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ServiceOrdersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [condoFilter, setCondoFilter] = useState('all')
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all')

  const { data: ordersData, isLoading: ordersLoading } = trpc.contracts.serviceOrders.getAll.useQuery()
  const { data: condosData } = trpc.condos.getAll.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  const deleteOrderMutation = trpc.contracts.serviceOrders.delete.useMutation({
    onSuccess: () => {
      toast.success('Intervention supprimée avec succès')
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'intervention")
    }
  })

  if (ordersLoading) {
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

  const orders = ordersData?.orders || []
  const condos = condosData?.condos || []

  const filteredServiceOrders = orders.filter((order: any) => {
    const matchesSearch = order.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.provider_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesCondo = condoFilter === 'all' || order.condo_id === condoFilter
    const matchesServiceType = serviceTypeFilter === 'all' || order.service_type === serviceTypeFilter

    return matchesSearch && matchesStatus && matchesCondo && matchesServiceType
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, any> = {
      scheduled: 'default',
      in_progress: 'secondary',
      completed: 'outline',
      cancelled: 'destructive',
      on_hold: 'outline'
    }
    return colors[status] || 'secondary'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      scheduled: 'Programmé',
      in_progress: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
      on_hold: 'En attente',
      pending: 'En attente'
    }
    return labels[status] || status
  }

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      low: 'text-green-600',
      normal: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    }
    return colors[urgency] || 'text-gray-600'
  }

  const getUrgencyLabel = (urgency: string) => {
    const labels: Record<string, string> = {
      low: 'Faible',
      normal: 'Normale',
      high: 'Élevée',
      urgent: 'Urgente'
    }
    return labels[urgency] || urgency
  }

  const handleDeleteOrder = async (orderId: string) => {
    await deleteOrderMutation.mutateAsync({ id: orderId })
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Interventions</h1>
          <p className="text-muted-foreground">
            Gérez vos interventions et réparations
          </p>
        </div>
        <Button onClick={() => router.push('/syndic/service-orders/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Intervention
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
                  placeholder="Rechercher un ordre de service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="scheduled">Programmé</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
                <SelectItem value="on_hold">En attente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="repair">Réparation</SelectItem>
                <SelectItem value="plumbing">Plomberie</SelectItem>
                <SelectItem value="electrical">Électricité</SelectItem>
                <SelectItem value="cleaning">Nettoyage</SelectItem>
                <SelectItem value="security">Sécurité</SelectItem>
                <SelectItem value="gardening">Jardinage</SelectItem>
                <SelectItem value="painting">Peinture</SelectItem>
                <SelectItem value="heating">Chauffage</SelectItem>
                <SelectItem value="emergency">Urgence</SelectItem>
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

      {filteredServiceOrders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {orders.length === 0
                ? 'Aucune intervention trouvée'
                : 'Aucune intervention ne correspond aux filtres sélectionnés'}
            </p>
            {orders.length === 0 && (
              <Button onClick={() => router.push('/syndic/service-orders/new')}>
                <Plus className="mr-2 h-4 w-4" />
                Programmer votre première intervention
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredServiceOrders.map((order: any) => {
            const condo = condos.find(c => c.id === order.condo_id)

            return (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {order.title || 'Intervention'}
                        <Badge variant={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                        <Badge variant="outline">
                          {order.service_type}
                        </Badge>
                        {order.urgency_level && (
                          <Badge variant="secondary" className={getUrgencyColor(order.urgency_level)}>
                            {getUrgencyLabel(order.urgency_level)}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {order.description}
                      </CardDescription>
                      {condo && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {condo.name} - {condo.address}
                        </p>
                      )}
                      {order.provider_name && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Prestataire: {order.provider_name}
                        </p>
                      )}
                      {order.assigned_technician && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Technicien: {order.assigned_technician}
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
                            <AlertDialogTitle>Supprimer l&apos;intervention</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette intervention ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteOrder(order.id)}
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
                      <p className="font-medium">Date d&apos;intervention</p>
                      <p className="text-muted-foreground">
                        {order.intervention_date
                          ? new Date(order.intervention_date).toLocaleDateString('fr-FR', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'À planifier'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Coût estimé</p>
                      <p className="text-muted-foreground">
                        {order.intervention_cost ? `${order.intervention_cost.toLocaleString()}€` : 'Non défini'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Durée estimée</p>
                      <p className="text-muted-foreground">
                        {order.estimated_duration_hours
                          ? `${order.estimated_duration_hours}h`
                          : 'Non défini'}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Statut</p>
                      <p className="text-muted-foreground">
                        {order.completion_date
                          ? `Terminé le ${new Date(order.completion_date).toLocaleDateString('fr-FR')}`
                          : getStatusLabel(order.status)}
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