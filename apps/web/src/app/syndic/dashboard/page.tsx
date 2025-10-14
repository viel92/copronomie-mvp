'use client'

import { trpc } from '@/lib/trpc'
import { Button, Badge } from '@copronomie/ui'
import { FolderKanban, Building, FileText, Plus, Loader2, Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { StatCard } from '@/components/dashboard/StatCard'
import { DashboardCard, DashboardCardHeader, DashboardCardTitle, DashboardCardContent } from '@/components/dashboard/DashboardCard'

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
          <h1 className="text-4xl font-bold text-landing-primary">Tableau de bord Syndic</h1>
          <p className="text-landing-primary/60 mt-2">
            {selectedCondo ? `Copropriété: ${selectedCondo.name}` : "Vue d'ensemble de toutes les copropriétés"}
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedCondoId}
            onChange={(e) => setSelectedCondoId(e.target.value)}
            className="px-4 py-2.5 bg-landing-gray-dark border-0 rounded-medium text-landing-primary focus:ring-2 focus:ring-landing-blue transition-all"
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
            className="shadow-card hover:shadow-card-hover"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau projet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Projets actifs"
          value={activeProjects.length}
          icon={FolderKanban}
          color="blue"
        />

        <StatCard
          title={selectedCondoId === 'all' ? 'Copropriétés' : 'Lots'}
          value={selectedCondoId === 'all' ? condos.length : (selectedCondo?.units_count || 0)}
          icon={Building}
          color="purple"
        />

        <StatCard
          title="Devis reçus"
          value={analytics?.analytics.totalQuotes || 0}
          icon={FileText}
          color="orange"
        />

        <StatCard
          title="Alertes"
          value={alerts?.count || 0}
          icon={Bell}
          color="pink"
          subtitle="Non lues"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard className="lg:col-span-2">
          <DashboardCardHeader>
            <DashboardCardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-landing-blue" />
              Projets récents
            </DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardContent>
            <div className="space-y-4">
              {recentProjects.length > 0 ? recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-landing-gray-dark rounded-medium cursor-pointer hover:bg-landing-blue-lite transition-all"
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
                <div className="text-center py-8 text-landing-primary/60">
                  Aucun projet récent
                </div>
              )}
            </div>
          </DashboardCardContent>
        </DashboardCard>

        <DashboardCard>
          <DashboardCardHeader>
            <DashboardCardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-landing-purple" />
              Statistiques
            </DashboardCardTitle>
          </DashboardCardHeader>
          <DashboardCardContent>
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
          </DashboardCardContent>
        </DashboardCard>
      </div>
    </div>
  )
}