export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type UserRole = 'syndic' | 'company' | 'condo'

export type ProjectStatus = 'draft' | 'active' | 'completed' | 'cancelled'

export type ProjectType = 'renovation' | 'maintenance' | 'emergency' | 'improvement'

export type QuoteStatus = 'pending' | 'approved' | 'rejected' | 'expired'

export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

export interface User extends BaseEntity {
  email: string
  full_name: string | null
  phone: string | null
  role: UserRole
  avatar_url: string | null
  is_active: boolean
}