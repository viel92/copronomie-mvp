import { supabaseClient } from '../config/supabase'

export interface Project {
  id: string
  title: string
  description: string
  syndic_id: string
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'archived'
  budget?: number
  deadline?: string
  created_at: string
  updated_at: string
}

export interface CreateProjectInput {
  title: string
  description?: string
  type: string
  condo_id: string
  syndic_id: string
  budget_min?: number
  budget_max?: number
  deadline?: string
  status?: 'draft' | 'published'
}

export interface UpdateProjectInput {
  title?: string
  description?: string
  status?: Project['status']
  budget?: number
  deadline?: string
}

export class ProjectService {
  async getAllProjects(userId: string, userRole: string) {
    const query = supabaseClient
      .from('projects')
      .select('*')

    if (userRole === 'syndic') {
      query.eq('syndic_id', userId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getProjectById(projectId: string, userId: string, userRole: string) {
    let query = supabaseClient
      .from('projects')
      .select('*')
      .eq('id', projectId)

    if (userRole === 'syndic') {
      query = query.eq('syndic_id', userId)
    }

    const { data, error } = await query.single()

    if (error) throw error
    return data
  }

  async createProject(input: CreateProjectInput) {
    const { data, error } = await supabaseClient
      .from('projects')
      .insert({
        ...input,
        status: input.status || 'draft'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateProject(
    projectId: string,
    input: UpdateProjectInput,
    userId: string
  ) {
    const { data, error } = await supabaseClient
      .from('projects')
      .update(input)
      .eq('id', projectId)
      .eq('syndic_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteProject(projectId: string, userId: string) {
    const { error } = await supabaseClient
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('syndic_id', userId)

    if (error) throw error
    return { success: true }
  }

  async getProjectQuotes(projectId: string) {
    const { data, error } = await supabaseClient
      .from('quotes')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async publishProject(projectId: string, userId: string) {
    return this.updateProject(projectId, { status: 'published' }, userId)
  }

  async archiveProject(projectId: string, userId: string) {
    return this.updateProject(projectId, { status: 'archived' }, userId)
  }
}

export const projectService = new ProjectService()
