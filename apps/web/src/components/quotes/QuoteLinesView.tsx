'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@copronomie/ui'
import { Calculator, FileText } from 'lucide-react'

export interface QuoteLine {
  id: string
  description: string
  quantity: number
  unit_price_ht: number
  vat_rate: number
  total_ht: number
  total_vat: number
  total_ttc: number
}

interface QuoteLinesViewProps {
  lines: QuoteLine[]
}

export function QuoteLinesView({ lines }: QuoteLinesViewProps) {
  // Calculate VAT summary grouped by rate
  const vatSummary = lines.reduce((acc, line) => {
    const rate = line.vat_rate
    if (!acc[rate]) {
      acc[rate] = { vat_rate: rate, total_ht: 0, total_vat: 0, total_ttc: 0 }
    }
    acc[rate].total_ht += line.total_ht
    acc[rate].total_vat += line.total_vat
    acc[rate].total_ttc += line.total_ttc
    return acc
  }, {} as Record<number, { vat_rate: number; total_ht: number; total_vat: number; total_ttc: number }>)

  const globalTotals = Object.values(vatSummary).reduce(
    (acc, curr) => ({
      total_ht: acc.total_ht + curr.total_ht,
      total_vat: acc.total_vat + curr.total_vat,
      total_ttc: acc.total_ttc + curr.total_ttc,
    }),
    { total_ht: 0, total_vat: 0, total_ttc: 0 }
  )

  if (lines.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucune ligne de devis disponible
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Détail du devis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Description</th>
                  <th className="text-right p-2 font-medium">Qté</th>
                  <th className="text-right p-2 font-medium">Prix Unit. HT</th>
                  <th className="text-right p-2 font-medium">Total HT</th>
                  <th className="text-right p-2 font-medium">TVA</th>
                  <th className="text-right p-2 font-medium">Total TTC</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, index) => (
                  <tr key={line.id} className="border-b last:border-b-0">
                    <td className="p-2">
                      <div className="font-medium">{line.description}</div>
                    </td>
                    <td className="text-right p-2">
                      {line.quantity.toLocaleString('fr-FR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="text-right p-2">
                      {line.unit_price_ht.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} €
                    </td>
                    <td className="text-right p-2">
                      {line.total_ht.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} €
                    </td>
                    <td className="text-right p-2">
                      <span className="text-xs text-muted-foreground">
                        {line.vat_rate}%
                      </span>
                      <br />
                      {line.total_vat.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} €
                    </td>
                    <td className="text-right p-2 font-medium">
                      {line.total_ttc.toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Récapitulatif TVA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.values(vatSummary).map((summary) => (
              <div
                key={summary.vat_rate}
                className="grid grid-cols-4 gap-4 py-2 border-b last:border-b-2 last:border-primary/20"
              >
                <div className="font-medium">TVA {summary.vat_rate}%</div>
                <div className="text-right text-sm">
                  Base HT:{' '}
                  <span className="font-medium">
                    {summary.total_ht.toLocaleString('fr-FR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} €
                  </span>
                </div>
                <div className="text-right text-sm">
                  Montant TVA:{' '}
                  <span className="font-medium">
                    {summary.total_vat.toLocaleString('fr-FR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} €
                  </span>
                </div>
                <div className="text-right text-sm">
                  Total TTC:{' '}
                  <span className="font-medium">
                    {summary.total_ttc.toLocaleString('fr-FR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} €
                  </span>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-4 gap-4 pt-4 text-lg font-bold">
              <div className="text-primary">TOTAL GÉNÉRAL</div>
              <div className="text-right">
                {globalTotals.total_ht.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} € HT
              </div>
              <div className="text-right">
                {globalTotals.total_vat.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} € TVA
              </div>
              <div className="text-right text-primary">
                {globalTotals.total_ttc.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} € TTC
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
