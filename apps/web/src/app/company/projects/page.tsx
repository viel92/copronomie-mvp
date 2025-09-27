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
  MapPin,
  Euro,
  Clock,
  Loader2,
  FileText,
  Calendar,
  Building
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CompanyProjectsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [budgetFilter, setBudgetFilter] = useState('all')

  const { data: projectsData, isLoading: projectsLoading } = trpc.projects.getAll.useQuery()
  const { data: condosData } = trpc.condos.getAll.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  if (projectsLoading) {
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

  const projects = projectsData?.projects || []
  const condos = condosData?.condos || []

  const publishedProjects = projects.filter((p: any) => p.status === 'published')

  const filteredProjects = publishedProjects.filter((project: any) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === 'all' || project.type === typeFilter

    const matchesBudget = budgetFilter === 'all' ||
      (budgetFilter === 'low' && project.budget_max && project.budget_max < 10000) ||
      (budgetFilter === 'medium' && project.budget_max && project.budget_max >= 10000 && project.budget_max < 50000) ||
      (budgetFilter === 'high' && project.budget_max && project.budget_max >= 50000)

    return matchesSearch && matchesType && matchesBudget
  })

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projets Disponibles</h1>
          <p className="text-muted-foreground mt-1">
            Trouvez des projets correspondant à votre expertise
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres de recherche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un projet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Type de travaux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="roofing">Toiture</SelectItem>
                <SelectItem value="heating">Chauffage</SelectItem>
                <SelectItem value="plumbing">Plomberie</SelectItem>
                <SelectItem value="electrical">Électricité</SelectItem>
                <SelectItem value="painting">Peinture</SelectItem>
                <SelectItem value="masonry">Maçonnerie</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les budgets</SelectItem>
                <SelectItem value="low">&lt; 10,000€</SelectItem>
                <SelectItem value="medium">10,000€ - 50,000€</SelectItem>
                <SelectItem value="high">&gt; 50,000€</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              {projects.length === 0
                ? 'Aucun projet disponible pour le moment'
                : 'Aucun projet ne correspond à vos critères de recherche'}
            </p>
            <p className="text-sm text-muted-foreground">
              Revenez plus tard ou modifiez vos filtres
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredProjects.map((project: any) => {
            const condo = condos.find(c => c.id === project.condo_id)

            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>{project.title}</CardTitle>
                        <Badge variant="secondary">
                          {getProjectType(project.type)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {project.description || 'Pas de description'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                        <p className="font-medium">Budget</p>
                        <p className="text-muted-foreground text-xs">
                          {project.budget_min?.toLocaleString()}€ - {project.budget_max?.toLocaleString()}€
                        </p>
                      </div>
                    </div>

                    {project.deadline && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="text-sm">
                          <p className="font-medium">Échéance</p>
                          <p className="text-muted-foreground text-xs">
                            {new Date(project.deadline).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-medium">Publié</p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(project.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/syndic/projects/${project.id}`)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Voir détails
                    </Button>
                    <Button
                      onClick={() => router.push(`/company/quotes/new?projectId=${project.id}`)}
                    >
                      Soumettre un devis
                    </Button>
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