import { supabaseClient } from '../config/supabase'

export interface Subscription {
  id: string
  entity_id: string
  entity_type: 'syndic' | 'company' | 'condo'
  status: 'active' | 'trialing' | 'canceled' | 'past_due'
  plan: 'basic' | 'premium' | 'enterprise'
  current_period_start: string
  current_period_end: string
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

export interface CreateSubscriptionInput {
  entity_id: string
  entity_type: 'syndic' | 'company' | 'condo'
  plan: 'basic' | 'premium' | 'enterprise'
  trial_ends_at?: string
}

export interface UpdateSubscriptionInput {
  status?: Subscription['status']
  plan?: Subscription['plan']
  current_period_start?: string
  current_period_end?: string
  trial_ends_at?: string
}

export class SubscriptionService {
  async getByEntity(entityId: string, entityType: string) {
    const { data, error } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('entity_id', entityId)
      .eq('entity_type', entityType)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  async create(input: CreateSubscriptionInput) {
    const currentDate = new Date()
    const periodEnd = new Date()
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    const { data, error } = await supabaseClient
      .from('subscriptions')
      .insert({
        ...input,
        status: input.trial_ends_at ? 'trialing' : 'active',
        current_period_start: currentDate.toISOString(),
        current_period_end: periodEnd.toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(entityId: string, input: UpdateSubscriptionInput) {
    const { data, error } = await supabaseClient
      .from('subscriptions')
      .update(input)
      .eq('entity_id', entityId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async cancel(entityId: string) {
    const { data, error } = await supabaseClient
      .from('subscriptions')
      .update({ status: 'canceled' })
      .eq('entity_id', entityId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export const subscriptionService = new SubscriptionService()