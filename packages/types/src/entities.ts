import { BaseEntity, ProjectStatus, ProjectType, QuoteStatus } from './common'

export interface Syndic extends BaseEntity {
  user_id: string
  company_name: string
  siret: string | null
  address: string | null
  city: string | null
  postal_code: string | null
  description: string | null
}

export interface Company extends BaseEntity {
  user_id: string
  company_name: string
  siret: string | null
  specialty: string[]
  address: string | null
  city: string | null
  postal_code: string | null
  description: string | null
  website: string | null
  rating: number | null
  verified: boolean
}

export interface Condo extends BaseEntity {
  syndic_id: string
  name: string
  address: string
  city: string
  postal_code: string
  unit_count: number | null
  description: string | null
  construction_year: number | null
}

export interface Project extends BaseEntity {
  syndic_id: string
  condo_id: string | null
  title: string
  description: string | null
  project_type: ProjectType
  status: ProjectStatus
  estimated_budget: number | null
  deadline: string | null
  priority: 'low' | 'medium' | 'high'
  attachments: string[] | null
}

export interface Quote extends BaseEntity {
  project_id: string
  company_id: string
  amount: number
  description: string | null
  status: QuoteStatus
  valid_until: string | null
  attachments: string[] | null
  notes: string | null
}

export interface Alert extends BaseEntity {
  syndic_id: string
  title: string
  message: string
  alert_type: string
  entity_type: string | null
  entity_id: string | null
  is_read: boolean
  is_sent: boolean
  email_sent: boolean
  trigger_date: string | null
  metadata: Record<string, any> | null
}