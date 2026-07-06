import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/api/projects.api'

export function useProjects(search?: string) {
  return useQuery({
    queryKey: ['projects', search ?? ''],
    queryFn: () => projectsApi.list(search),
  })
}
