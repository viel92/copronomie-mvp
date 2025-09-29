'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@copronomie/ui'
import {
  Search,
  Users,
  Star,
  Award,
  Filter,
  Loader2,
  Building2,
  Mail
} from 'lucide-react'
import { useState } from 'react'

export default function SyndicCompaniesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')

  const { data: companiesData, isLoading } = trpc.companies.getAll.useQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const companies = companiesData?.companies || []

  const specialties = [
    'roofing', 'heating', 'elevator', 'painting', 'facade', 'plumbing', 'electrical'
  ]

  const getSpecialtyLabel = (specialty: string) => {
    const labels: Record<string, string> = {
      roofing: 'Toiture',
      heating: 'Chauffage',
      elevator: 'Ascenseur',
      painting: 'Peinture',
      facade: 'Façade',
      plumbing: 'Plomberie',
      electrical: 'Électricité'
    }
    return labels[specialty] || specialty
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = specialtyFilter === 'all' ||
      (company.specialties && company.specialties.includes(specialtyFilter))
    const matchesRating = ratingFilter === 'all' ||
      (ratingFilter === '4+' && (company.rating || 0) >= 4) ||
      (ratingFilter === '3+' && (company.rating || 0) >= 3)

    return matchesSearch && matchesSpecialty && matchesRating
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const avgRating = companies.length > 0
    ? (companies.reduce((sum: number, c: any) => sum + (c.rating || 0), 0) / companies.length).toFixed(1)
    : '0.0'

  const certifiedCount = companies.filter((c: any) =>
    c.certifications && Object.keys(c.certifications as any).length > 0
  ).length

  const activeThisMonth = Math.round(companies.length * 0.75)

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Réseau d'Entreprises</h1>
          <p className="text-muted-foreground mt-1">
            Découvrez et contactez les entreprises partenaires
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Award className="h-4 w-4 mr-2" />
            Entreprises certifiées
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total entreprises</p>
                <p className="text-2xl font-bold">{companies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
                <p className="text-2xl font-bold">{avgRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Certifiées</p>
                <p className="text-2xl font-bold">{certifiedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Actives ce mois</p>
                <p className="text-2xl font-bold">{activeThisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une entreprise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Spécialité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes spécialités</SelectItem>
                {specialties.map(specialty => (
                  <SelectItem key={specialty} value={specialty}>
                    {getSpecialtyLabel(specialty)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[150px]">
                <Star className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes notes</SelectItem>
                <SelectItem value="4+">4+ étoiles</SelectItem>
                <SelectItem value="3+">3+ étoiles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Aucune entreprise trouvée</h3>
                  <p className="text-muted-foreground">
                    Aucune entreprise ne correspond à vos critères de recherche
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCompanies.map((company: any) => (
              <Card key={company.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{company.name}</CardTitle>
                      {company.siret && (
                        <p className="text-sm text-muted-foreground mt-1">
                          SIRET: {company.siret}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(company.rating || 0)}
                      <span className="ml-1 text-sm text-muted-foreground">
                        {(company.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {company.specialties && company.specialties.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Spécialités</h4>
                      <div className="flex flex-wrap gap-1">
                        {company.specialties.map((specialty: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {getSpecialtyLabel(specialty)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {company.certifications && Object.keys(company.certifications as any).length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Certifications</h4>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Entreprise certifiée</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      Membre depuis {new Date(company.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm">
                        Voir profil
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}