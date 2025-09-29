import { supabaseClient } from '../config/supabase'

export interface AnalyticsData {
  totalProjects: number
  totalQuotes: number
  totalContracts: number
  totalCondos: number
  totalBudget: number
  projectsByStatus: Record<string, number>
  quotesByStatus: Record<string, number>
  recentActivity: any[]
}

export class AnalyticsService {
  async getSyndicAnalytics(syndicId: string): Promise<AnalyticsData> {
    const [projects, quotes, contracts, condos, budget] = await Promise.all([
      this.getProjectStats(syndicId),
      this.getQuoteStats(syndicId),
      this.getContractStats(syndicId),
      this.getCondoCount(syndicId),
      this.getTotalBudget(syndicId),
    ])

    return {
      totalProjects: projects.total,
      totalQuotes: quotes.total,
      totalContracts: contracts.total,
      totalCondos: condos,
      totalBudget: budget,
      projectsByStatus: projects.byStatus,
      quotesByStatus: quotes.byStatus,
      recentActivity: await this.getRecentActivity(syndicId),
    }
  }

  private async getProjectStats(syndicId: string) {
    const { data, error } = await supabaseClient
      .from('projects')
      .select('status')
      .eq('syndic_id', syndicId)

    if (error) throw error

    const byStatus = data.reduce((acc: Record<string, number>, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    }, {})

    return {
      total: data.length,
      byStatus,
    }
  }

  private async getQuoteStats(syndicId: string) {
    const { data: projectsData } = await supabaseClient
      .from('projects')
      .select('id')
      .eq('syndic_id', syndicId)

    const projectIds = projectsData?.map(p => p.id) || []

    if (projectIds.length === 0) {
      return { total: 0, byStatus: {} }
    }

    const { data, error } = await supabaseClient
      .from('quotes')
      .select('status, project_id')
      .in('project_id', projectIds)

    if (error) throw error

    const byStatus = (data || []).reduce((acc: Record<string, number>, quote) => {
      acc[quote.status] = (acc[quote.status] || 0) + 1
      return acc
    }, {})

    return {
      total: data?.length || 0,
      byStatus,
    }
  }

  private async getContractStats(syndicId: string) {
    const [property, energy, service] = await Promise.all([
      supabaseClient.from('property_contracts').select('id', { count: 'exact', head: true }).eq('syndic_id', syndicId),
      supabaseClient.from('energy_contracts').select('id', { count: 'exact', head: true }).eq('syndic_id', syndicId),
      supabaseClient.from('service_orders').select('id', { count: 'exact', head: true }).eq('syndic_id', syndicId),
    ])

    return {
      total: (property.count || 0) + (energy.count || 0) + (service.count || 0),
    }
  }

  private async getCondoCount(syndicId: string) {
    const { count, error } = await supabaseClient
      .from('condos')
      .select('*', { count: 'exact', head: true })
      .eq('syndic_id', syndicId)

    if (error) throw error
    return count || 0
  }

  private async getTotalBudget(syndicId: string) {
    const { data, error } = await supabaseClient
      .from('projects')
      .select('budget_max, budget_min')
      .eq('syndic_id', syndicId)

    if (error) throw error

    const totalBudget = (data || []).reduce((sum, project) => {
      const budget = project.budget_max || project.budget_min || 0
      return sum + budget
    }, 0)

    return totalBudget
  }

  private async getRecentActivity(syndicId: string) {
    const { data, error } = await supabaseClient
      .from('projects')
      .select('id, title, status, created_at')
      .eq('syndic_id', syndicId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return data
  }
}

export const analyticsService = new AnalyticsService()