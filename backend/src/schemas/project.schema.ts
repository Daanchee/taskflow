import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createProjectSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  description: z.string().max(500).optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectIdParamSchema = z.object({
  id: z.string().uuid('El id del proyecto debe ser un UUID válido'),
});

export const listProjectsQuerySchema = z.object({
  search: z.string().optional(),
});

export type Project = z.infer<typeof projectSchema>;
export type CreateProjectDTO = z.infer<typeof createProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>;
export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;
