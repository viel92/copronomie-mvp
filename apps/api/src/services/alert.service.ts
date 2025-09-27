import { supabaseClient } from '../config/supabase'

export interface Alert {
  id: string
  syndic_id: string
  type: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  message: string
  is_read: boolean
  created_at: string
}

export interface AlertSetting {
  id: string
  syndic_id: string
  alert_type: string
  enabled: boolean
  config?: any
}

export class AlertService {
  async getAlertsBySyndic(syndicId: string) {
    const { data, error } = await supabaseClient
      .from('alerts')
      .select('*')
      .eq('syndic_id', syndicId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async createAlert(input: Omit<Alert, 'id' | 'created_at'>) {
    const { data, error } = await supabaseClient
      .from('alerts')
      .insert({
        ...input,
        is_read: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async markAsRead(alertId: string) {
    const { data, error } = await supabaseClient
      .from('alerts')
      .update({ is_read: true })
      .eq('id', alertId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteAlert(alertId: string) {
    const { error } = await supabaseClient
      .from('alerts')
      .delete()
      .eq('id', alertId)

    if (error) throw error
    return { success: true }
  }

  async getAlertSettings(syndicId: string) {
    const { data, error } = await supabaseClient
      .from('alert_settings')
      .select('*')
      .eq('syndic_id', syndicId)

    if (error) throw error
    return data
  }

  async updateAlertSetting(settingId: string, input: Partial<AlertSetting>) {
    const { data, error } = await supabaseClient
      .from('alert_settings')
      .update(input)
      .eq('id', settingId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUnreadCount(syndicId: string) {
    const { count, error } = await supabaseClient
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('syndic_id', syndicId)
      .eq('is_read', false)

    if (error) throw error
    return count || 0
  }
}

export const alertService = new AlertService()