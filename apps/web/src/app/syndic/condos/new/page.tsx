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
  const [searchMode, setSearchMode] = useState<'registry' | 'siret' | 'manual'>('registry')
  const [selectedRegistry, setSelectedRegistry] = useState<any>(null)

  // SIRET search state
  const [siretQuery, setSiretQuery] = useState('')
  const [siretFilters, setSiretFilters] = useState({
    ville: '',
    code_postal: '',
    minLots: '',
    maxLots: ''
  })
  const [selectedCondos, setSelectedCondos] = useState<any[]>([])

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

  const { data: registryData, isLoading: searchLoading, refetch: refetchRegistry } = trpc.condos.searchRegistry.useQuery(
    { query: searchQuery },
    { enabled: false } // Désactiver auto-fetch, utiliser bouton
  )

  const { data: siretData, isLoading: siretLoading, refetch: refetchSiret } = trpc.condos.searchBySiret.useQuery(
    {
      siret: siretQuery,
      filters: {} // Pas de filtres API, on filtre en local
    },
    { enabled: false }
  )

  // Filtrage LOCAL des resultats (pas de refetch API)
  const filteredSiretResults = siretData?.results ? siretData.results.filter((condo: any) => {
    const ville = condo.commune_reference || condo.commune
    const codePostal = condo.code_postal_reference || ''
    const nbLots = condo.nombre_total_lots || 0

    if (siretFilters.ville && !ville?.toLowerCase().includes(siretFilters.ville.toLowerCase())) {
      return false
    }

    if (siretFilters.code_postal && !codePostal.startsWith(siretFilters.code_postal)) {
      return false
    }

    if (siretFilters.minLots && nbLots < parseInt(siretFilters.minLots)) {
      return false
    }

    if (siretFilters.maxLots && nbLots > parseInt(siretFilters.maxLots)) {
      return false
    }

    return true
  }) : []

  const createCondoMutation = trpc.condos.create.useMutation({
    onSuccess: () => {
      toast.success('Copropriété créée avec succès')
      router.push('/syndic/condos')
    },
    onError: () => {
      toast.error('Erreur lors de la création de la copropriété')
    }
  })

  const bulkImportMutation = trpc.condos.bulkImport.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.condos.length} copropriété(s) importée(s) avec succès`)
      setSelectedCondos([])
      setSiretQuery('')
      // Rafraîchir la page des copropriétés après import
      setTimeout(() => {
        router.push('/syndic/condos')
      }, 1000)
    },
    onError: (error) => {
      const errorMessage = error.message.toLowerCase()
      if (errorMessage.includes('duplicate key') ||
          errorMessage.includes('immatriculation') ||
          errorMessage.includes('unique constraint')) {
        toast.error('❌ Certaines copropriétés sont déjà importées (numéro d\'immatriculation existant)')
      } else {
        toast.error('❌ Erreur lors de l\'import: ' + error.message)
      }
    }
  })

  const handleRegistrySelect = (registry: any) => {
    setSelectedRegistry(registry)
    setFormData({
      ...formData,
      name: registry.nom_usage_copropriete || registry.adresse_reference || '',
      address: registry.numero_et_voie || registry.adresse_reference || '',
      city: registry.commune_reference || registry.commune || '',
      postal_code: registry.code_postal_reference || '',
      numero_immatriculation: registry.numero_immatriculation || '',
      periode_construction: registry.periode_construction || '',
      type_syndic: registry.type_syndic || '',
      date_immatriculation: registry.date_immatriculation || '',
      nombre_lots_habitation: registry.nombre_lots_habitation?.toString() || '',
      nombre_lots_stationnement: registry.nombre_lots_stationnement?.toString() || ''
    })
    setSearchMode('manual')
  }

  const handleRegistrySearch = () => {
    if (!searchQuery || searchQuery.length < 3) {
      toast.error('Veuillez entrer au moins 3 caractères')
      return
    }
    refetchRegistry()
  }

  const handleSiretSearch = () => {
    if (!siretQuery || siretQuery.length < 14) {
      toast.error('Veuillez entrer un numéro SIRET valide (14 chiffres)')
      return
    }
    setSelectedCondos([])
    refetchSiret()
  }

  const handleToggleCondo = (condo: any) => {
    setSelectedCondos(prev => {
      const exists = prev.find(c => c.numero_immatriculation === condo.numero_immatriculation)
      if (exists) {
        return prev.filter(c => c.numero_immatriculation !== condo.numero_immatriculation)
      }
      return [...prev, condo]
    })
  }

  const handleToggleAll = () => {
    if (filteredSiretResults.length === 0) return
    if (selectedCondos.length === filteredSiretResults.length) {
      setSelectedCondos([])
    } else {
      setSelectedCondos(filteredSiretResults)
    }
  }

  const handleBulkImport = async () => {
    if (selectedCondos.length === 0) {
      toast.error('Veuillez sélectionner au moins une copropriété')
      return
    }

    const condosToImport = selectedCondos.map(condo => ({
      name: condo.nom_usage_copropriete || condo.adresse_reference || 'Sans nom',
      address: condo.numero_et_voie || condo.adresse_reference || '',
      city: condo.commune_reference || condo.commune || undefined,
      postal_code: condo.code_postal_reference || undefined,
      numero_immatriculation: condo.numero_immatriculation || undefined,
      periode_construction: condo.periode_construction || undefined,
      type_syndic: condo.type_syndic || undefined,
      date_immatriculation: condo.date_immatriculation || undefined,
      nombre_lots_habitation: condo.nombre_lots_habitation || undefined,
      nombre_lots_stationnement: condo.nombre_lots_stationnement || undefined,
    }))

    await bulkImportMutation.mutateAsync({ condos: condosToImport })
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="registry">
            <Search className="h-4 w-4 mr-2" />
            Recherche Simple
          </TabsTrigger>
          <TabsTrigger value="siret">
            <Building2 className="h-4 w-4 mr-2" />
            Import par SIRET
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
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Ville, code postal, adresse ou N° immatriculation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegistrySearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleRegistrySearch} disabled={searchLoading || searchQuery.length < 3}>
                  {searchLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recherche...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Rechercher
                    </>
                  )}
                </Button>
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
                        <p className="font-medium">{result.nom_usage_copropriete || result.adresse_reference}</p>
                        <p className="text-sm text-muted-foreground">
                          {result.numero_et_voie || result.adresse_reference}, {result.code_postal_reference} {result.commune_reference || result.commune}
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

        <TabsContent value="siret">
          <Card>
            <CardHeader>
              <CardTitle>Import par SIRET</CardTitle>
              <CardDescription>
                Importez plusieurs copropriétés en une seule fois depuis votre SIRET
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Entrez votre SIRET (14 chiffres)"
                    value={siretQuery}
                    onChange={(e) => setSiretQuery(e.target.value)}
                    maxLength={14}
                  />
                </div>
                <Button onClick={handleSiretSearch} disabled={siretLoading}>
                  {siretLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Recherche...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Rechercher
                    </>
                  )}
                </Button>
              </div>

              {siretData?.results && siretData.results.length > 0 && (
                <>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      {filteredSiretResults.length} copropriété(s) affichée(s) sur {siretData.results.length} trouvée(s)
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleAll}
                    >
                      {selectedCondos.length === filteredSiretResults.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <Input
                      placeholder="Filtrer par ville"
                      value={siretFilters.ville}
                      onChange={(e) => setSiretFilters({...siretFilters, ville: e.target.value})}
                    />
                    <Input
                      placeholder="Code postal"
                      value={siretFilters.code_postal}
                      onChange={(e) => setSiretFilters({...siretFilters, code_postal: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Min lots"
                      value={siretFilters.minLots}
                      onChange={(e) => setSiretFilters({...siretFilters, minLots: e.target.value})}
                    />
                    <Input
                      type="number"
                      placeholder="Max lots"
                      value={siretFilters.maxLots}
                      onChange={(e) => setSiretFilters({...siretFilters, maxLots: e.target.value})}
                    />
                  </div>

                  {(siretFilters.ville || siretFilters.code_postal || siretFilters.minLots || siretFilters.maxLots) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSiretFilters({ ville: '', code_postal: '', minLots: '', maxLots: '' })}
                    >
                      Réinitialiser les filtres
                    </Button>
                  )}

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredSiretResults.map((condo: any) => {
                        const isSelected = selectedCondos.find(c => c.numero_immatriculation === condo.numero_immatriculation)
                        return (
                          <Card
                            key={condo.numero_immatriculation}
                            className={`cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-accent'}`}
                            onClick={() => handleToggleCondo(condo)}
                          >
                            <CardContent className="pt-4">
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={!!isSelected}
                                  onChange={() => handleToggleCondo(condo)}
                                  className="mt-1"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{condo.nom_usage_copropriete || condo.adresse_reference}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {condo.numero_et_voie || condo.adresse_reference}, {condo.code_postal_reference} {condo.commune_reference || condo.commune}
                                  </p>
                                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                    {condo.nombre_lots_total && (
                                      <span>{condo.nombre_lots_total} lots</span>
                                    )}
                                    {condo.type_syndic && (
                                      <span>{condo.type_syndic}</span>
                                    )}
                                    {condo.periode_construction && (
                                      <span>{condo.periode_construction}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                  </div>

                  {selectedCondos.length > 0 && (
                    <div className="flex items-center justify-between p-4 bg-primary/10 border border-primary rounded-lg">
                      <p className="font-medium">
                        {selectedCondos.length} copropriété(s) sélectionnée(s)
                      </p>
                      <Button
                        onClick={handleBulkImport}
                        disabled={bulkImportMutation.isPending}
                      >
                        {bulkImportMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Import en cours...
                          </>
                        ) : (
                          `Importer ${selectedCondos.length} copropriété(s)`
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}

              {siretQuery && !siretLoading && siretData?.results?.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucune copropriété trouvée pour ce SIRET
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
                      name="name"
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
                      name="address"
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