import { supabaseClient, supabaseAdmin } from '../config/supabase'
import { sanitizePlainText, sanitizeHtml } from '../lib/sanitize'

export interface Project {
  id: string
  title: string
  description: string
  syndic_id: string
  status: 'draft' | 'published' | 'analyzing' | 'awarded' | 'completed' | 'archived'
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
  status?: 'draft' | 'published' | 'analyzing' | 'awarded' | 'completed'
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
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    // CRITIQUE-7: Sanitization des inputs utilisateur
    const sanitizedInput = {
      ...input,
      title: sanitizePlainText(input.title), // Titre sans HTML
      description: input.description ? sanitizeHtml(input.description) : undefined, // Description peut contenir du HTML formaté
      type: sanitizePlainText(input.type), // Type sans HTML
      status: input.status || 'draft'
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert(sanitizedInput)
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
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    // CRITIQUE-7: Sanitization des inputs utilisateur
    const sanitizedInput: UpdateProjectInput = {}

    if (input.title !== undefined) {
      sanitizedInput.title = sanitizePlainText(input.title)
    }
    if (input.description !== undefined) {
      sanitizedInput.description = sanitizeHtml(input.description)
    }
    if (input.status !== undefined) {
      sanitizedInput.status = input.status
    }
    if (input.budget !== undefined) {
      sanitizedInput.budget = input.budget
    }
    if (input.deadline !== undefined) {
      sanitizedInput.deadline = input.deadline
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(sanitizedInput)
      .eq('id', projectId)
      .eq('syndic_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteProject(projectId: string, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    const { error } = await supabaseAdmin
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

  async changeProjectStatus(
    projectId: string,
    status: 'draft' | 'published' | 'analyzing' | 'awarded' | 'completed',
    userId: string
  ) {
    return this.updateProject(projectId, { status }, userId)
  }

  async awardProject(projectId: string, winningQuoteId: string, userId: string) {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }

    // Update the winning quote and set project to awarded
    const project = await this.updateProject(projectId, { status: 'awarded' }, userId)

    // Update winning quote status
    await supabaseAdmin
      .from('quotes')
      .update({ status: 'accepted' })
      .eq('id', winningQuoteId)
      .eq('project_id', projectId)

    // Update other quotes to rejected
    await supabaseAdmin
      .from('quotes')
      .update({ status: 'rejected' })
      .eq('project_id', projectId)
      .neq('id', winningQuoteId)

    return project
  }
}

export const projectService = new ProjectService()
