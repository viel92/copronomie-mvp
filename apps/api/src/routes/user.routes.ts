import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { authMiddleware, requireRole } from '../middleware/auth.middleware'
import { supabaseClient } from '../config/supabase'

const app = new Hono()

// All routes require authentication
app.use('*', authMiddleware)

/**
 * GET /api/users
 * Get all users (admin only)
 */
app.get('/',
  requireRole(['syndic']),
  async (c) => {
    try {
      const { data, error } = await supabaseClient
        .from('users')
        .select('*')
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
      throw new HTTPException(500, { message: 'Failed to fetch users' })
    }
  }
)

/**
 * GET /api/users/:id
 * Get user by ID
 */
app.get('/:id', async (c) => {
  const userId = c.req.param('id')
  const currentUser = c.get('user')

  // Users can only access their own profile unless they're admin
  if (currentUser.id !== userId && currentUser.role !== 'syndic') {
    throw new HTTPException(403, { message: 'Access denied' })
  }

  try {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw new HTTPException(404, { message: 'User not found' })
    }

    return c.json({
      success: true,
      data,
    })
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to fetch user' })
  }
})

/**
 * PUT /api/users/:id
 * Update user profile
 */
app.put('/:id', async (c) => {
  const userId = c.req.param('id')
  const currentUser = c.get('user')
  const body = await c.req.json()

  // Users can only update their own profile
  if (currentUser.id !== userId && currentUser.role !== 'syndic') {
    throw new HTTPException(403, { message: 'Access denied' })
  }

  try {
    const { data, error } = await supabaseClient
      .from('users')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new HTTPException(400, { message: error.message })
    }

    return c.json({
      success: true,
      message: 'User updated successfully',
      data,
    })
  } catch (error) {
    if (error instanceof HTTPException) throw error
    throw new HTTPException(500, { message: 'Failed to update user' })
  }
})

/**
 * DELETE /api/users/:id
 * Delete user (admin only)
 */
app.delete('/:id',
  requireRole(['syndic']),
  async (c) => {
    const userId = c.req.param('id')

    try {
      const { error } = await supabaseClient
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) {
        throw new HTTPException(400, { message: error.message })
      }

      return c.json({
        success: true,
        message: 'User deleted successfully',
      })
    } catch (error) {
      if (error instanceof HTTPException) throw error
      throw new HTTPException(500, { message: 'Failed to delete user' })
    }
  }
)

export default app