import { supabaseClient } from '../config/supabase'

export interface PropertyContract {
  id: string
  syndic_id: string
  condo_id: string
  title: string
  description?: string
  contract_type: string
  current_provider?: string
  contract_value?: number
  contract_start?: string
  contract_end?: string
  renewal_date?: string
  renewal_notice_days?: number
  status?: string
  created_at: string
}

export interface EnergyContract {
  id: string
  syndic_id: string
  condo_id: string
  title: string
  description?: string
  energy_type: string
  current_provider?: string
  contract_reference?: string
  annual_consumption?: number
  unit_price?: number
  fixed_cost?: number
  contract_start?: string
  contract_end?: string
  renewal_notice_days?: number
  status?: string
  created_at: string
}

export interface ServiceOrder {
  id: string
  syndic_id: string
  condo_id: string
  title: string
  description?: string
  service_type: string
  provider_name?: string
  monthly_cost?: number
  annual_cost?: number
  contract_start?: string
  contract_end?: string
  renewal_notice_days?: number
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
}

export class ContractService {
  async getPropertyContracts(syndicId: string) {
    const { data, error } = await supabaseClient
      .from('property_contracts')
      .select('*')
      .eq('syndic_id', syndicId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async createPropertyContract(input: Omit<PropertyContract, 'id' | 'created_at'>) {
    const { data, error } = await supabaseClient
      .from('property_contracts')
      .insert(input)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updatePropertyContract(contractId: string, input: Partial<PropertyContract>) {
    const { data, error } = await supabaseClient
      .from('property_contracts')
      .update(input)
      .eq('id', contractId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deletePropertyContract(contractId: string) {
    const { error } = await supabaseClient
      .from('property_contracts')
      .delete()
      .eq('id', contractId)

    if (error) throw error
    return { success: true }
  }

  async getEnergyContracts(syndicId: string) {
    const { data, error } = await supabaseClient
      .from('energy_contracts')
      .select('*')
      .eq('syndic_id', syndicId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async createEnergyContract(input: Omit<EnergyContract, 'id' | 'created_at'>) {
    const { data, error } = await supabaseClient
      .from('energy_contracts')
      .insert(input)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateEnergyContract(contractId: string, input: Partial<EnergyContract>) {
    const { data, error } = await supabaseClient
      .from('energy_contracts')
      .update(input)
      .eq('id', contractId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteEnergyContract(contractId: string) {
    const { error } = await supabaseClient
      .from('energy_contracts')
      .delete()
      .eq('id', contractId)

    if (error) throw error
    return { success: true }
  }

  async getServiceOrders(syndicId: string) {
    const { data, error } = await supabaseClient
      .from('service_orders')
      .select('*')
      .eq('syndic_id', syndicId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async createServiceOrder(input: Omit<ServiceOrder, 'id' | 'created_at'>) {
    const { data, error } = await supabaseClient
      .from('service_orders')
      .insert({
        ...input,
        status: input.status || 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateServiceOrder(orderId: string, input: Partial<ServiceOrder>) {
    const { data, error } = await supabaseClient
      .from('service_orders')
      .update(input)
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteServiceOrder(orderId: string) {
    const { error } = await supabaseClient
      .from('service_orders')
      .delete()
      .eq('id', orderId)

    if (error) throw error
    return { success: true }
  }
}

export const contractService = new ContractService()
