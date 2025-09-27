import { BaseEntity } from './common'

export interface PropertyContract extends BaseEntity {
  syndic_id: string
  condo_id: string | null
  contract_type: string
  provider_name: string
  provider_contact: string | null
  start_date: string
  end_date: string | null
  auto_renewal: boolean
  monthly_cost: number | null
  annual_cost: number | null
  description: string | null
  terms: string | null
  attachments: string[] | null
}

export interface EnergyContract extends BaseEntity {
  syndic_id: string
  condo_id: string | null
  energy_type: 'electricity' | 'gas' | 'water' | 'heating'
  provider_name: string
  provider_contact: string | null
  contract_reference: string | null
  start_date: string
  end_date: string | null
  unit_price: number | null
  fixed_cost: number | null
  consumption_estimate: number | null
  auto_renewal: boolean
  description: string | null
  attachments: string[] | null
}