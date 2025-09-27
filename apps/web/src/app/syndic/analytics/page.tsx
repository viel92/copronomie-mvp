'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
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
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Activity,
  Loader2,
  RefreshCw,
  Download,
  FolderKanban,
  FileText,
  Building,
  Euro
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function SyndicAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month')
  const [activeTab, setActiveTab] = useState('overview')

  const { data: analytics, isLoading, refetch, isRefetching } = trpc.analytics.getSyndicAnalytics.useQuery()
  const { data: user } = trpc.auth.me.useQuery()

  const handleRefresh = async () => {
    await refetch()
    toast.success('Données actualisées')
  }

  if (isLoading) {
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

  const data = analytics?.analytics || {
    totalProjects: 0,
    totalQuotes: 0,
    totalBudget: 0,
    projectsByStatus: {},
    quotesByStatus: {}
  }

  const totalProjectsCount = Object.values(data.projectsByStatus).reduce((sum: number, val) => sum + (val as number), 0)
  const totalQuotesCount = data.totalQuotes

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Brouillon',
      published: 'Publié',
      analyzing: 'En analyse',
      awarded: 'Attribué',
      completed: 'Terminé',
      pending: 'En attente',
      submitted: 'Soumis',
      accepted: 'Accepté',
      rejected: 'Rejeté'
    }
    return labels[status] || status
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Métriques</h1>
          <p className="text-muted-foreground">
            Analyses détaillées de performance et KPIs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as 'month' | 'quarter' | 'year')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Vue d&apos;ensemble
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Projets
          </TabsTrigger>
          <TabsTrigger value="quotes" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Devis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <FolderKanban className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projets</p>
                    <p className="text-2xl font-bold">{data.totalProjects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Devis</p>
                    <p className="text-2xl font-bold">{data.totalQuotes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Euro className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget Total</p>
                    <p className="text-2xl font-bold">{data.totalBudget.toLocaleString()}€</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-secondary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Taux conversion</p>
                    <p className="text-2xl font-bold">
                      {data.totalQuotes > 0 ? Math.round((data.totalQuotes / data.totalProjects) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projets par statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(data.projectsByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <FolderKanban className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{getStatusLabel(status)}</span>
                      </div>
                      <Badge variant="outline">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Devis par statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(data.quotesByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-600/10 rounded-md">
                          <FileText className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="font-medium">{getStatusLabel(status)}</span>
                      </div>
                      <Badge variant="outline">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalProjectsCount}</p>
                  <p className="text-sm text-muted-foreground">Projets total</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{Object.keys(data.projectsByStatus).length}</p>
                  <p className="text-sm text-muted-foreground">Statuts différents</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {Math.round((data.totalBudget / totalProjectsCount) || 0).toLocaleString()}€
                  </p>
                  <p className="text-sm text-muted-foreground">Budget moyen</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribution des projets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(data.projectsByStatus).map(([status, count]) => (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{getStatusLabel(status)}</span>
                      <span className="font-medium">{count as number}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2"
                        style={{ width: `${((count as number) / totalProjectsCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{totalQuotesCount}</p>
                  <p className="text-sm text-muted-foreground">Devis total</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {(data.quotesByStatus.accepted as number) || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Devis acceptés</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {totalQuotesCount > 0
                      ? Math.round((((data.quotesByStatus.accepted as number) || 0) / totalQuotesCount) * 100)
                      : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Taux acceptation</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribution des devis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(data.quotesByStatus).map(([status, count]) => (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{getStatusLabel(status)}</span>
                      <span className="font-medium">{count as number}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-600 rounded-full h-2"
                        style={{ width: `${((count as number) / totalQuotesCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}