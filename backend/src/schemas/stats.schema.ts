import { z } from 'zod';

export const statsByStatusSchema = z.object({
  TODO: z.number().int().nonnegative(),
  IN_PROGRESS: z.number().int().nonnegative(),
  DONE: z.number().int().nonnegative(),
});

export const statsByPrioritySchema = z.object({
  LOW: z.number().int().nonnegative(),
  MEDIUM: z.number().int().nonnegative(),
  HIGH: z.number().int().nonnegative(),
});

export const projectTaskCountSchema = z.object({
  projectId: z.string().uuid(),
  projectName: z.string(),
  taskCount: z.number().int().nonnegative(),
});

export const completedTrendPointSchema = z.object({
  date: z.string(),
  count: z.number().int().nonnegative(),
});

export const dashboardStatsSchema = z.object({
  byStatus: statsByStatusSchema,
  byPriority: statsByPrioritySchema,
  byProject: z.array(projectTaskCountSchema),
  completedTrend: z.array(completedTrendPointSchema),
});

export type StatsByStatus = z.infer<typeof statsByStatusSchema>;
export type StatsByPriority = z.infer<typeof statsByPrioritySchema>;
export type ProjectTaskCount = z.infer<typeof projectTaskCountSchema>;
export type CompletedTrendPoint = z.infer<typeof completedTrendPointSchema>;
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
