'use client'

import { trpc } from '@/lib/trpc'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@copronomie/ui'
import {
  FileText,
  Euro,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type QuoteStatus = 'draft' | 'submitted' | 'accepted' | 'rejected'

export default function CompanyQuotesPage() {
  const router = useRouter()
  const { data: user } = trpc.auth.me.useQuery()
  const { data: quotesData, isLoading } = trpc.quotes.getByCompany.useQuery(
    { companyId: user?.user.id || '' },
    { enabled: !!user?.user.id }
  )

  const [selectedTab, setSelectedTab] = useState<QuoteStatus | 'all'>('all')

  const quotes = quotesData?.quotes || []

  // Filter quotes by status
  const filteredQuotes = selectedTab === 'all'
    ? quotes
    : quotes.filter(q => q.status === selectedTab)

  // Count by status
  const counts = {
    all: quotes.length,
    draft: quotes.filter(q => q.status === 'draft').length,
    submitted: quotes.filter(q => q.status === 'submitted').length,
    accepted: quotes.filter(q => q.status === 'accepted').length,
    rejected: quotes.filter(q => q.status === 'rejected').length
  }

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Accepté</Badge>
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeté</Badge>
      case 'submitted':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Soumis</Badge>
      case 'draft':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Brouillon</Badge>
    }
  }

  if (user?.user?.role !== 'company') {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes Devis</h1>
        <p className="text-muted-foreground mt-1">
          Gérez tous vos devis soumis et suivez leur statut
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.all}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Soumis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{counts.submitted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Acceptés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{counts.accepted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejetés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{counts.rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Liste des devis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as QuoteStatus | 'all')}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Tous ({counts.all})</TabsTrigger>
              <TabsTrigger value="draft">Brouillons ({counts.draft})</TabsTrigger>
              <TabsTrigger value="submitted">Soumis ({counts.submitted})</TabsTrigger>
              <TabsTrigger value="accepted">Acceptés ({counts.accepted})</TabsTrigger>
              <TabsTrigger value="rejected">Rejetés ({counts.rejected})</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                          <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="h-12 bg-muted animate-pulse rounded" />
                          <div className="h-12 bg-muted animate-pulse rounded" />
                          <div className="h-12 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredQuotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Aucun devis trouvé</p>
                  <p className="text-muted-foreground mt-1">
                    {selectedTab === 'all'
                      ? 'Vous n\'avez pas encore soumis de devis'
                      : `Vous n'avez pas de devis ${selectedTab === 'draft' ? 'en brouillon' : selectedTab === 'submitted' ? 'soumis' : selectedTab === 'accepted' ? 'acceptés' : 'rejetés'}`
                    }
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push('/company/projects')}
                  >
                    Voir les projets disponibles
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuotes.map((quote) => (
                    <Card key={quote.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold">
                                Devis #{quote.id.slice(0, 8)}
                              </h3>
                              {getStatusBadge(quote.status)}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Euro className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Montant</p>
                                  <p className="text-muted-foreground">
                                    {quote.amount.toLocaleString('fr-FR')} €
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Soumis le</p>
                                  <p className="text-muted-foreground">
                                    {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                              </div>

                              {quote.valid_until && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="font-medium">Valide jusqu'au</p>
                                    <p className="text-muted-foreground">
                                      {new Date(quote.valid_until).toLocaleDateString('fr-FR')}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {quote.description && (
                              <div className="pt-2">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {quote.description}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/company/projects/${quote.project_id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir le projet
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
