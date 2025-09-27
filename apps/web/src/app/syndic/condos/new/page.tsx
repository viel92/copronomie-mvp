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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@copronomie/ui'
import { Building2, Search, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function NewCondoPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMode, setSearchMode] = useState<'registry' | 'manual'>('registry')
  const [selectedRegistry, setSelectedRegistry] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postal_code: '',
    units_count: '',
    numero_immatriculation: '',
    periode_construction: '',
    type_syndic: '',
    date_immatriculation: '',
    nombre_lots_habitation: '',
    nombre_lots_stationnement: '',
    subscription_plan: 'basic',
    referral_code: ''
  })

  const { data: registryData, isLoading: searchLoading } = trpc.condos.searchRegistry.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length >= 3 }
  )

  const createCondoMutation = trpc.condos.create.useMutation({
    onSuccess: () => {
      toast.success('Copropriété créée avec succès')
      router.push('/syndic/condos')
    },
    onError: () => {
      toast.error('Erreur lors de la création de la copropriété')
    }
  })

  const handleRegistrySelect = (registry: any) => {
    setSelectedRegistry(registry)
    setFormData({
      ...formData,
      name: registry.nom || '',
      address: registry.adresse || '',
      city: registry.ville || '',
      postal_code: registry.code_postal || '',
      numero_immatriculation: registry.numero_immatriculation || '',
      periode_construction: registry.periode_construction || '',
      type_syndic: registry.type_syndic || '',
      date_immatriculation: registry.date_immatriculation || '',
      nombre_lots_habitation: registry.nombre_lots_habitation?.toString() || '',
      nombre_lots_stationnement: registry.nombre_lots_stationnement?.toString() || ''
    })
    setSearchMode('manual')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.address) {
      toast.error('Nom et adresse sont requis')
      return
    }

    await createCondoMutation.mutateAsync({
      name: formData.name,
      address: formData.address,
      city: formData.city || undefined,
      postal_code: formData.postal_code || undefined,
      units_count: formData.units_count ? parseInt(formData.units_count) : undefined,
      numero_immatriculation: formData.numero_immatriculation || undefined,
      periode_construction: formData.periode_construction || undefined,
      type_syndic: formData.type_syndic || undefined,
      date_immatriculation: formData.date_immatriculation || undefined,
      nombre_lots_habitation: formData.nombre_lots_habitation ? parseInt(formData.nombre_lots_habitation) : undefined,
      nombre_lots_stationnement: formData.nombre_lots_stationnement ? parseInt(formData.nombre_lots_stationnement) : undefined,
      subscription_plan: formData.subscription_plan || undefined,
      referral_code: formData.referral_code || undefined
    })
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nouvelle Copropriété</h1>
          <p className="text-muted-foreground">
            Créez une nouvelle copropriété à gérer
          </p>
        </div>
      </div>

      <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="registry">
            <Search className="h-4 w-4 mr-2" />
            Recherche Registre
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Building2 className="h-4 w-4 mr-2" />
            Saisie Manuelle
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registry">
          <Card>
            <CardHeader>
              <CardTitle>Recherche dans le registre national</CardTitle>
              <CardDescription>
                Recherchez une copropriété par ville, code postal, adresse ou numéro d'immatriculation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher (min 3 caractères)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {searchLoading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {registryData?.results && registryData.results.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {registryData.results.map((result: any) => (
                    <Card
                      key={result.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleRegistrySelect(result)}
                    >
                      <CardContent className="pt-4">
                        <p className="font-medium">{result.nom || result.adresse}</p>
                        <p className="text-sm text-muted-foreground">
                          {result.adresse}, {result.code_postal} {result.ville}
                        </p>
                        {result.numero_immatriculation && (
                          <p className="text-xs text-muted-foreground mt-1">
                            N° {result.numero_immatriculation}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {searchQuery.length >= 3 && !searchLoading && registryData?.results?.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  Aucun résultat trouvé. Passez à la saisie manuelle.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Informations de la copropriété</CardTitle>
                <CardDescription>
                  Renseignez les informations de la copropriété
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la copropriété *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Résidence Les Jardins"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="12 rue de la Paix"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Paris"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Code postal</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      placeholder="75001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="units_count">Nombre total de lots</Label>
                    <Input
                      id="units_count"
                      type="number"
                      value={formData.units_count}
                      onChange={(e) => setFormData({ ...formData, units_count: e.target.value })}
                      placeholder="50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numero_immatriculation">Numéro d'immatriculation</Label>
                    <Input
                      id="numero_immatriculation"
                      value={formData.numero_immatriculation}
                      onChange={(e) => setFormData({ ...formData, numero_immatriculation: e.target.value })}
                      placeholder="075-001-001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periode_construction">Période de construction</Label>
                    <Input
                      id="periode_construction"
                      value={formData.periode_construction}
                      onChange={(e) => setFormData({ ...formData, periode_construction: e.target.value })}
                      placeholder="1980-1990"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type_syndic">Type de syndic</Label>
                    <Select
                      value={formData.type_syndic}
                      onValueChange={(value) => setFormData({ ...formData, type_syndic: value })}
                    >
                      <SelectTrigger id="type_syndic">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professionnel">Professionnel</SelectItem>
                        <SelectItem value="benevole">Bénévole</SelectItem>
                        <SelectItem value="cooperatif">Coopératif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_immatriculation">Date d'immatriculation</Label>
                    <Input
                      id="date_immatriculation"
                      type="date"
                      value={formData.date_immatriculation}
                      onChange={(e) => setFormData({ ...formData, date_immatriculation: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombre_lots_habitation">Nombre de lots d'habitation</Label>
                    <Input
                      id="nombre_lots_habitation"
                      type="number"
                      value={formData.nombre_lots_habitation}
                      onChange={(e) => setFormData({ ...formData, nombre_lots_habitation: e.target.value })}
                      placeholder="40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nombre_lots_stationnement">Nombre de lots de stationnement</Label>
                    <Input
                      id="nombre_lots_stationnement"
                      type="number"
                      value={formData.nombre_lots_stationnement}
                      onChange={(e) => setFormData({ ...formData, nombre_lots_stationnement: e.target.value })}
                      placeholder="10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscription_plan">Plan d'abonnement</Label>
                    <Select
                      value={formData.subscription_plan}
                      onValueChange={(value) => setFormData({ ...formData, subscription_plan: value })}
                    >
                      <SelectTrigger id="subscription_plan">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basique</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Entreprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referral_code">Code de parrainage</Label>
                    <Input
                      id="referral_code"
                      value={formData.referral_code}
                      onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
                      placeholder="CODE123"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" disabled={createCondoMutation.isPending}>
                    {createCondoMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      'Créer la copropriété'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}