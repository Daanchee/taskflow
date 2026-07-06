import { httpClient } from './http-client'
import type { CreateProjectDTO, Project, UpdateProjectDTO } from '@/types/project'

export const projectsApi = {
  list: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : ''
    return httpClient.get<Project[]>(`/projects${query}`)
  },
  getById: (id: string) => httpClient.get<Project>(`/projects/${id}`),
  create: (data: CreateProjectDTO) => httpClient.post<Project>('/projects', data),
  update: (id: string, data: UpdateProjectDTO) => httpClient.put<Project>(`/projects/${id}`, data),
  remove: (id: string) => httpClient.delete<void>(`/projects/${id}`),
}
