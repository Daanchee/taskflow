import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '@/api/projects.api'

export function useProject(id: string | undefined) {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getById(id as string),
    enabled: Boolean(id),
  })
}
