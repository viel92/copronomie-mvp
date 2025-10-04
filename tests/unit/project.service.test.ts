import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ProjectService, CreateProjectInput, UpdateProjectInput } from '../../apps/api/src/services/project.service'

// Mock Supabase clients
vi.mock('../../apps/api/src/config/supabase', () => ({
  supabaseClient: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
  supabaseAdmin: {
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
  },
}))

describe('ProjectService', () => {
  let projectService: ProjectService

  beforeEach(() => {
    projectService = new ProjectService()
    vi.clearAllMocks()
  })

  describe('createProject', () => {
    it('should create a draft project successfully', async () => {
      const mockInput: CreateProjectInput = {
        title: 'Test Project',
        description: 'Test Description',
        type: 'renovation',
        condo_id: 'condo-123',
        syndic_id: 'syndic-123',
        budget_min: 5000,
        budget_max: 10000,
        deadline: '2025-12-31',
      }

      const mockResponse = {
        id: 'project-123',
        ...mockInput,
        status: 'draft',
        created_at: '2025-10-02',
        updated_at: '2025-10-02',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null }),
      } as any)

      const result = await projectService.createProject(mockInput)

      expect(result).toEqual(mockResponse)
      expect(mockFrom).toHaveBeenCalledWith('projects')
    })

    it('should create a published project when status is specified', async () => {
      const mockInput: CreateProjectInput = {
        title: 'Published Project',
        description: 'To be published',
        type: 'maintenance',
        condo_id: 'condo-456',
        syndic_id: 'syndic-456',
        status: 'published',
      }

      const mockResponse = {
        id: 'project-456',
        ...mockInput,
        status: 'published',
        created_at: '2025-10-02',
        updated_at: '2025-10-02',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null }),
      } as any)

      const result = await projectService.createProject(mockInput)

      expect(result.status).toBe('published')
    })

    it('should throw error when Supabase returns error', async () => {
      const mockInput: CreateProjectInput = {
        title: 'Error Project',
        type: 'renovation',
        condo_id: 'condo-789',
        syndic_id: 'syndic-789',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('Database error') }),
      } as any)

      await expect(projectService.createProject(mockInput)).rejects.toThrow('Database error')
    })
  })

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      const projectId = 'project-123'
      const userId = 'syndic-123'
      const updateInput: UpdateProjectInput = {
        title: 'Updated Title',
        description: 'Updated Description',
      }

      const mockResponse = {
        id: projectId,
        ...updateInput,
        syndic_id: userId,
        status: 'draft',
        created_at: '2025-10-01',
        updated_at: '2025-10-02',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null }),
      } as any)

      const result = await projectService.updateProject(projectId, updateInput, userId)

      expect(result).toEqual(mockResponse)
      expect(mockFrom).toHaveBeenCalledWith('projects')
    })

    it('should only allow syndic to update their own projects', async () => {
      const projectId = 'project-123'
      const userId = 'syndic-456'  // Different syndic
      const updateInput: UpdateProjectInput = {
        title: 'Unauthorized Update',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      const mockEq = vi.fn().mockReturnThis()

      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: mockEq,
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: new Error('No rows found') }),
      } as any)

      await expect(projectService.updateProject(projectId, updateInput, userId)).rejects.toThrow()
      expect(mockEq).toHaveBeenCalledWith('syndic_id', userId)
    })
  })

  describe('publishProject', () => {
    it('should change project status to published', async () => {
      const projectId = 'project-123'
      const userId = 'syndic-123'

      const mockResponse = {
        id: projectId,
        title: 'Project to Publish',
        syndic_id: userId,
        status: 'published',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      mockFrom.mockReturnValue({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockResponse, error: null }),
      } as any)

      const result = await projectService.publishProject(projectId, userId)

      expect(result.status).toBe('published')
    })
  })

  describe('awardProject', () => {
    it('should award project and update quotes correctly', async () => {
      const projectId = 'project-123'
      const winningQuoteId = 'quote-winning'
      const userId = 'syndic-123'

      const mockProjectResponse = {
        id: projectId,
        title: 'Awarded Project',
        syndic_id: userId,
        status: 'awarded',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)

      // Mock project update
      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProjectResponse, error: null }),
      } as any)

      // Mock winning quote update
      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      } as any)

      // Mock other quotes update
      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
      } as any)

      const result = await projectService.awardProject(projectId, winningQuoteId, userId)

      expect(result.status).toBe('awarded')
      expect(mockFrom).toHaveBeenCalledTimes(3) // project update + 2 quotes updates
    })

    it('should reject other quotes when awarding project', async () => {
      const projectId = 'project-123'
      const winningQuoteId = 'quote-winning'
      const userId = 'syndic-123'

      const mockProjectResponse = {
        id: projectId,
        status: 'awarded',
      }

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)
      const mockNeq = vi.fn().mockReturnThis()

      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProjectResponse, error: null }),
      } as any)

      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      } as any)

      mockFrom.mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: mockNeq,
      } as any)

      await projectService.awardProject(projectId, winningQuoteId, userId)

      expect(mockNeq).toHaveBeenCalledWith('id', winningQuoteId)
    })
  })

  describe('getAllProjects', () => {
    it('should return all projects for syndic filtered by syndic_id', async () => {
      const userId = 'syndic-123'
      const userRole = 'syndic'

      const mockProjects = [
        { id: 'project-1', title: 'Project 1', syndic_id: userId },
        { id: 'project-2', title: 'Project 2', syndic_id: userId },
      ]

      const { supabaseClient } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseClient.from)
      const mockEq = vi.fn().mockReturnThis()

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        order: vi.fn().mockResolvedValue({ data: mockProjects, error: null }),
      } as any)

      const result = await projectService.getAllProjects(userId, userRole)

      expect(result).toEqual(mockProjects)
      expect(mockEq).toHaveBeenCalledWith('syndic_id', userId)
    })

    it('should return all published projects for company without filtering', async () => {
      const userId = 'company-123'
      const userRole = 'company'

      const mockProjects = [
        { id: 'project-1', title: 'Project 1', status: 'published' },
        { id: 'project-2', title: 'Project 2', status: 'published' },
      ]

      const { supabaseClient } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseClient.from)
      const mockEq = vi.fn().mockReturnThis()

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: mockEq,
        order: vi.fn().mockResolvedValue({ data: mockProjects, error: null }),
      } as any)

      const result = await projectService.getAllProjects(userId, userRole)

      expect(result).toEqual(mockProjects)
      expect(mockEq).not.toHaveBeenCalled() // No filtering for company
    })
  })

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      const projectId = 'project-123'
      const userId = 'syndic-123'

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)

      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })

      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: mockEq1
        }),
      } as any)

      const result = await projectService.deleteProject(projectId, userId)

      expect(result).toEqual({ success: true })
      expect(mockFrom).toHaveBeenCalledWith('projects')
    })

    it('should throw error when deletion fails', async () => {
      const projectId = 'project-123'
      const userId = 'syndic-123'

      const { supabaseAdmin } = await import('../../apps/api/src/config/supabase')
      const mockFrom = vi.mocked(supabaseAdmin.from)

      const mockEq2 = vi.fn().mockResolvedValue({ error: new Error('Cannot delete') })
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })

      mockFrom.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: mockEq1
        }),
      } as any)

      await expect(projectService.deleteProject(projectId, userId)).rejects.toThrow('Cannot delete')
    })
  })
})
