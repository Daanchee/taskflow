import { useQuery } from '@tanstack/react-query'
import { tasksApi } from '@/api/tasks.api'
import type { TaskFilters } from '@/types/task'

export function useTasks(projectId: string | undefined, filters: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', projectId, filters],
    queryFn: () => tasksApi.listByProject(projectId as string, filters),
    enabled: Boolean(projectId),
  })
}
