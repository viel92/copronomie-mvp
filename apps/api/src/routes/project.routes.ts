import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware, requireRole } from '../middleware/auth.middleware'
import { supabaseClient } from '../config/supabase'

const app = new Hono()

// All routes require authentication
app.use('*', authMiddleware)

// Validation schemas
const createProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['maintenance', 'renovation', 'construction', 'other']),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']).default('draft'),
  budget: z.number().positive().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  condo_id: z.string().uuid(),
})

const updateProjectSchema = createProjectSchema.partial()

/**
 * GET /api/projects
 * Get all projects for the authenticated user
 */
app.get('/', async (c) => {
  const user = c.get('user')
  const { status, type, condo_id } = c.req.query()

  try {
    let query = supabaseClient
      .from('projects')
      .select(`
        *,
        condos (
          id,
          name,
          address
        ),
        quotes (
          id,
          amount,
          status,
          company_id
        )
      `)

    // Filter based on user role
    if (user.role === 'syndic') {
      query = query.eq('syndic_id', user.id)
    } else if (user.role === 'condo' && condo_id) {
      query = query.eq('condo_id', condo_id)
    }

    // Apply filters
    if (status) query = query.eq('status', status)
    if (type) query = query.eq('type', type)

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new HTTPException(400, { message: error.message })
    }

    return c.json({
      success: true,
      data,
      count: data.length,
    })
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to fetch projects' })
  }
})

/**
 * GET /api/projects/:id
 * Get project by ID
 */
app.get('/:id', async (c) => {
  const projectId = c.req.param('id')

  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .select(`
        *,
        condos (
          id,
          name,
          address
        ),
        quotes (
          id,
          amount,
          status,
          company_id,
          companies (
            id,
            name,
            email
          )
        )
      `)
      .eq('id', projectId)
      .single()

    if (error) {
      throw new HTTPException(404, { message: 'Project not found' })
    }

    return c.json({
      success: true,
      data,
    })
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to fetch project' })
  }
})

/**
 * POST /api/projects
 * Create a new project (syndic only)
 */
app.post('/',
  requireRole(['syndic']),
  zValidator('json', createProjectSchema),
  async (c) => {
    const user = c.get('user')
    const projectData = c.req.valid('json')

    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .insert({
          ...projectData,
          syndic_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        throw new HTTPException(400, { message: error.message })
      }

      return c.json({
        success: true,
        message: 'Project created successfully',
        data,
      }, 201)
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to create project' })
    }
  }
)

/**
 * PUT /api/projects/:id
 * Update project (syndic only)
 */
app.put('/:id',
  requireRole(['syndic']),
  zValidator('json', updateProjectSchema),
  async (c) => {
    const projectId = c.req.param('id')
    const updateData = c.req.valid('json')

    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId)
        .select()
        .single()

      if (error) {
        throw new HTTPException(400, { message: error.message })
      }

      return c.json({
        success: true,
        message: 'Project updated successfully',
        data,
      })
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to update project' })
    }
  }
)

/**
 * DELETE /api/projects/:id
 * Delete project (syndic only)
 */
app.delete('/:id',
  requireRole(['syndic']),
  async (c) => {
    const projectId = c.req.param('id')

    try {
      const { error } = await supabaseClient
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) {
        throw new HTTPException(400, { message: error.message })
      }

      return c.json({
        success: true,
        message: 'Project deleted successfully',
      })
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to delete project' })
    }
  }
)

/**
 * GET /api/projects/:id/quotes
 * Get all quotes for a project
 */
app.get('/:id/quotes', async (c) => {
  const projectId = c.req.param('id')

  try {
    const { data, error } = await supabaseClient
      .from('quotes')
      .select(`
        *,
        companies (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new HTTPException(400, { message: error.message })
    }

    return c.json({
      success: true,
      data,
      count: data.length,
    })
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to fetch quotes' })
  }
})

export default app