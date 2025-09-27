'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@copronomie/ui'

export default function CondoDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Copropriétaire</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ma Copropriété</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Informations sur votre copropriété</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projets en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aucun projet en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Accès aux documents de la copropriété</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aucun vote en attente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}