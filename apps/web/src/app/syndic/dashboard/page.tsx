'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge
} from '@copronomie/ui'
import { FolderKanban, Building, FileText, Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SyndicDashboard() {
  const router = useRouter()
  const [selectedCondoId, setSelectedCondoId] = useState<string>('all')

  const { data: analytics, isLoading: analyticsLoading } = trpc.analytics.getSyndicAnalytics.useQuery()
  const { data: condosData, isLoading: condosLoading } = trpc.condos.getAll.useQuery()
  const { data: projectsData, isLoading: projectsLoading } = trpc.projects.getAll.useQuery()
  const { data: alerts } = trpc.alerts.getUnreadCount.useQuery()

  const isLoading = analyticsLoading || condosLoading || projectsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const condos = condosData?.condos || []
  const projects = projectsData?.projects || []
  const selectedCondo = condos.find(c => c.id === selectedCondoId)

  const filteredProjects = selectedCondoId === 'all'
    ? projects
    : projects.filter(p => p.condo_id === selectedCondoId)

  const activeProjects = filteredProjects.filter(p =>
    ['published', 'in_progress'].includes(p.status || '')
  )
  const recentProjects = filteredProjects.slice(0, 3)

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      published: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
      archived: 'bg-red-100 text-red-800'
    }
    return styles[status as keyof typeof styles] || styles.draft
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      completed: 'Terminé',
      in_progress: 'En cours',
      published: 'Publié',
      draft: 'Brouillon',
      archived: 'Archivé'
    }
    return labels[status as keyof typeof labels] || status
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord Syndic</h1>
          <p className="text-muted-foreground mt-1">
            {selectedCondo ? `Copropriété: ${selectedCondo.name}` : "Vue d'ensemble de toutes les copropriétés"}
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedCondoId}
            onChange={(e) => setSelectedCondoId(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">Toutes les copropriétés</option>
            {condos.map(condo => (
              <option key={condo.id} value={condo.id}>
                {condo.name}
              </option>
            ))}
          </select>
          <Button
            variant="hero"
            onClick={() => router.push('/syndic/projects/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau projet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderKanban className="h-5 w-5 text-primary" />
              Projets actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeProjects.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building className="h-5 w-5 text-secondary" />
              {selectedCondoId === 'all' ? 'Copropriétés' : 'Lots'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {selectedCondoId === 'all' ? condos.length : (selectedCondo?.units_count || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-green-600" />
              Devis reçus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.analytics.totalQuotes || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-orange-600" />
              Alertes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{alerts?.count || 0}</p>
            <p className="text-sm text-muted-foreground">Non lues</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              Projets récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.length > 0 ? recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-card rounded-lg border border-border cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => router.push(`/syndic/projects/${project.id}`)}
                >
                  <div className="space-y-1">
                    <h4 className="font-medium">{project.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{project.description?.substring(0, 50)}...</span>
                      {project.budget && (
                        <>
                          <span>•</span>
                          <span>{project.budget.toLocaleString()}€</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusBadge(project.status || 'draft')}>
                    {getStatusLabel(project.status || 'draft')}
                  </Badge>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun projet récent
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-secondary" />
              Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Projets par statut</p>
                <div className="mt-2 space-y-2">
                  {Object.entries(analytics?.analytics.projectsByStatus || {}).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{getStatusLabel(status)}</span>
                      <span className="font-bold">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Devis par statut</p>
                <div className="mt-2 space-y-2">
                  {Object.entries(analytics?.analytics.quotesByStatus || {}).map(([status, count]) => (
                    <div key={status} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{status}</span>
                      <span className="font-bold">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}