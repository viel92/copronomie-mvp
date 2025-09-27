import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { projectService } from '../../services/project.service'

export const projectRouter = router({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const projects = await projectService.getAllProjects(
        ctx.user.id,
        ctx.user.role
      )
      return { success: true, projects }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const project = await projectService.getProjectById(
        input.id,
        ctx.user.id,
        ctx.user.role
      )
      return { success: true, project }
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        type: z.string(),
        condo_id: z.string(),
        budget_min: z.number().optional(),
        budget_max: z.number().optional(),
        deadline: z.string().optional(),
        status: z.enum(['draft', 'published']).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await projectService.createProject({
        ...input,
        syndic_id: ctx.user.id,
      })
      return { success: true, project }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['draft', 'published', 'in_progress', 'completed', 'archived']).optional(),
        budget: z.number().optional(),
        deadline: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input
      const project = await projectService.updateProject(
        id,
        updateData,
        ctx.user.id
      )
      return { success: true, project }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await projectService.deleteProject(input.id, ctx.user.id)
      return { success: true }
    }),

  getQuotes: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      const quotes = await projectService.getProjectQuotes(input.projectId)
      return { success: true, quotes }
    }),

  publish: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const project = await projectService.publishProject(input.id, ctx.user.id)
      return { success: true, project }
    }),

  archive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const project = await projectService.archiveProject(input.id, ctx.user.id)
      return { success: true, project }
    }),
})
