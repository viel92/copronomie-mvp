'use client'

import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@copronomie/ui'
import { useRouter } from 'next/navigation'
import { FolderKanban, FileText, CheckCircle, Clock, Loader2 } from 'lucide-react'

export default function CompanyDashboard() {
  const router = useRouter()
  const { data: user } = trpc.auth.me.useQuery()
  const { data: quotes, isLoading: quotesLoading } = trpc.quotes.getByCompany.useQuery(
    { companyId: user?.user.id || '' },
    { enabled: !!user?.user.id }
  )
  const { data: projectsData, isLoading: projectsLoading } = trpc.projects.getPublished.useQuery()

  const isLoading = quotesLoading || projectsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const projects = projectsData?.projects || []
  const myQuotes = quotes?.quotes || []
  const submittedQuotes = myQuotes.filter(q => q.status === 'submitted')
  const acceptedQuotes = myQuotes.filter(q => q.status === 'accepted')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Entreprise</h1>
        <p className="text-muted-foreground mt-1">
          Consultez les projets disponibles et gérez vos devis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderKanban className="h-5 w-5 text-primary" />
              Projets disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projects.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-blue-600" />
              Devis soumis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{submittedQuotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Devis acceptés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{acceptedQuotes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-orange-600" />
              Total devis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{myQuotes.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              Projets disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.length > 0 ? projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-card rounded-lg border border-border cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => router.push(`/company/projects/${project.id}`)}
                >
                  <div className="space-y-1">
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {project.description?.substring(0, 60)}...
                    </p>
                    {(project.budget_min || project.budget_max) && (
                      <p className="text-sm font-medium text-primary">
                        Budget: {project.budget_min?.toLocaleString()}€ - {project.budget_max?.toLocaleString()}€
                      </p>
                    )}
                  </div>
                  <Button size="sm" variant="outline">
                    Voir
                  </Button>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun projet disponible pour le moment
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-secondary" />
              Mes devis récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {myQuotes.length > 0 ? myQuotes.slice(0, 5).map((quote) => (
                <div key={quote.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Projet #{quote.project_id}</p>
                    <p className="text-sm text-muted-foreground">
                      {quote.total_ttc ? `${quote.total_ttc.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€` : 'Montant à calculer'}
                    </p>
                  </div>
                  <Badge className={
                    quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }>
                    {quote.status === 'accepted' ? 'Accepté' :
                     quote.status === 'rejected' ? 'Rejeté' :
                     'En attente'}
                  </Badge>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  Vous n'avez pas encore soumis de devis
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}