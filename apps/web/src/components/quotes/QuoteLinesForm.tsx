'use client'

import { useState } from 'react'
import { Button, Input, Label, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@copronomie/ui'
import { Plus, Trash2, Upload, FileText } from 'lucide-react'
import { toast } from 'sonner'

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

const VAT_RATES = [
  { value: 20, label: '20% - Taux normal' },
  { value: 10, label: '10% - Taux intermédiaire' },
  { value: 5.5, label: '5.5% - Taux réduit' },
  { value: 2.1, label: '2.1% - Taux super réduit' },
  { value: 0, label: '0% - Exonéré' },
]

interface QuoteLinesFormProps {
  lines: QuoteLine[]
  onChange: (lines: QuoteLine[]) => void
  disabled?: boolean
}

export function QuoteLinesForm({ lines, onChange, disabled }: QuoteLinesFormProps) {
  const calculateLineTotals = (
    quantity: number,
    unitPriceHT: number,
    vatRate: number
  ): { total_ht: number; total_vat: number; total_ttc: number } => {
    const total_ht = quantity * unitPriceHT
    const total_vat = total_ht * (vatRate / 100)
    const total_ttc = total_ht + total_vat

    return {
      total_ht: Math.round(total_ht * 100) / 100,
      total_vat: Math.round(total_vat * 100) / 100,
      total_ttc: Math.round(total_ttc * 100) / 100,
    }
  }

  const addLine = () => {
    const newLine: QuoteLine = {
      id: `temp-${Date.now()}`,
      description: '',
      quantity: 1,
      unit_price_ht: 0,
      vat_rate: 20,
      total_ht: 0,
      total_vat: 0,
      total_ttc: 0,
    }
    onChange([...lines, newLine])
  }

  const removeLine = (id: string) => {
    if (lines.length <= 1) {
      toast.error('Un devis doit avoir au moins une ligne')
      return
    }
    onChange(lines.filter((line) => line.id !== id))
  }

  const updateLine = (
    id: string,
    field: keyof QuoteLine,
    value: string | number
  ) => {
    const updatedLines = lines.map((line) => {
      if (line.id !== id) return line

      const updatedLine = { ...line, [field]: value }

      // Recalculate totals if relevant fields changed
      if (['quantity', 'unit_price_ht', 'vat_rate'].includes(field)) {
        const totals = calculateLineTotals(
          updatedLine.quantity,
          updatedLine.unit_price_ht,
          updatedLine.vat_rate
        )
        return { ...updatedLine, ...totals }
      }

      return updatedLine
    })

    onChange(updatedLines)
  }

  // Calculate global totals grouped by VAT rate
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

  return (
    <div className="space-y-4">
      {/* Table header */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium text-sm">Désignation</th>
              <th className="text-right p-3 font-medium text-sm w-24">Qté</th>
              <th className="text-right p-3 font-medium text-sm w-32">Prix U. HT</th>
              <th className="text-right p-3 font-medium text-sm w-32">Total HT</th>
              <th className="text-center p-3 font-medium text-sm w-20">TVA</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => (
              <tr key={line.id} className="border-t">
                <td className="p-3">
                  <Textarea
                    placeholder="Description du poste..."
                    value={line.description}
                    onChange={(e) =>
                      updateLine(line.id, 'description', e.target.value)
                    }
                    disabled={disabled}
                    rows={2}
                    className="min-h-0 resize-none"
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={line.quantity}
                    onChange={(e) =>
                      updateLine(
                        line.id,
                        'quantity',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    disabled={disabled}
                    className="text-right"
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={line.unit_price_ht}
                    onChange={(e) =>
                      updateLine(
                        line.id,
                        'unit_price_ht',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    disabled={disabled}
                    className="text-right"
                  />
                </td>
                <td className="p-3 text-right font-medium">
                  {line.total_ht.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                  })} €
                </td>
                <td className="p-3">
                  <Select
                    value={line.vat_rate.toString()}
                    onValueChange={(value) =>
                      updateLine(line.id, 'vat_rate', parseFloat(value))
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VAT_RATES.map((rate) => (
                        <SelectItem key={rate.value} value={rate.value.toString()}>
                          {rate.value}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-3 text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLine(line.id)}
                    disabled={disabled || lines.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addLine}
        disabled={disabled}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter une ligne
      </Button>

      {/* Summary */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Total HT</span>
            <span className="font-mono">
              {globalTotals.total_ht.toLocaleString('fr-FR', {
                minimumFractionDigits: 2,
              })} €
            </span>
          </div>

          {Object.values(vatSummary).map((summary) => (
            <div key={summary.vat_rate} className="flex justify-between text-sm text-muted-foreground">
              <span>TVA {summary.vat_rate}%</span>
              <span className="font-mono">
                {summary.total_vat.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                })} €
              </span>
            </div>
          ))}

          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total TTC</span>
              <span className="font-mono text-primary">
                {globalTotals.total_ttc.toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                })} €
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
