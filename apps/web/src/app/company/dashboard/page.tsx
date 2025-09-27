'use client'

import { trpc } from '@/lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '@copronomie/ui'

export default function CompanyDashboard() {
  const { data: user } = trpc.auth.me.useQuery()
  const { data: quotes } = trpc.quotes.getByCompany.useQuery(
    { companyId: user?.user.id || '' },
    { enabled: !!user?.user.id }
  )

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Entreprise</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Devis Soumis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {quotes?.quotes.filter(q => q.status === 'submitted').length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Devis Acceptés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {quotes?.quotes.filter(q => q.status === 'accepted').length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Devis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{quotes?.quotes.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes Devis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotes?.quotes.map((quote) => (
              <div key={quote.id} className="flex justify-between items-center p-4 border rounded">
                <div>
                  <p className="font-medium">Projet #{quote.project_id}</p>
                  <p className="text-sm text-muted-foreground">{quote.amount}€</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  quote.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {quote.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}