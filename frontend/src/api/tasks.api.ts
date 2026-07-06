import { httpClient } from './http-client'
import type { CreateTaskDTO, Task, TaskFilters, UpdateTaskDTO } from '@/types/task'

function buildQuery(filters?: TaskFilters): string {
  if (!filters) return ''
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.priority) params.set('priority', filters.priority)
  if (filters.search) params.set('search', filters.search)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const tasksApi = {
  listByProject: (projectId: string, filters?: TaskFilters) =>
    httpClient.get<Task[]>(`/projects/${projectId}/tasks${buildQuery(filters)}`),
  create: (projectId: string, data: CreateTaskDTO) =>
    httpClient.post<Task>(`/projects/${projectId}/tasks`, data),
  update: (id: string, data: UpdateTaskDTO) => httpClient.put<Task>(`/tasks/${id}`, data),
  remove: (id: string) => httpClient.delete<void>(`/tasks/${id}`),
}
