import { z } from 'zod';

export const taskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export type TaskStatus = z.infer<typeof taskStatusEnum>;
export type TaskPriority = z.infer<typeof taskPriorityEnum>;

export const taskSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  title: z.string().min(1).max(120),
  description: z.string().max(1000).optional(),
  status: taskStatusEnum,
  priority: taskPriorityEnum,
  dueDate: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(120),
  description: z.string().max(1000).optional(),
  status: taskStatusEnum.default('TODO'),
  priority: taskPriorityEnum.default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  description: z.string().max(1000).optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  dueDate: z.string().datetime().optional(),
});

export const taskIdParamSchema = z.object({
  id: z.string().uuid('El id de la tarea debe ser un UUID válido'),
});

export const projectIdParamSchema = z.object({
  projectId: z.string().uuid('El id del proyecto debe ser un UUID válido'),
});

export const taskFiltersQuerySchema = z.object({
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  search: z.string().optional(),
  dueBefore: z.string().datetime().optional(),
  dueAfter: z.string().datetime().optional(),
});

export type Task = z.infer<typeof taskSchema>;
export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
export type TaskFiltersQuery = z.infer<typeof taskFiltersQuerySchema>;
