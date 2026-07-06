import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { projectsApi } from '@/api/projects.api'
import { ApiError } from '@/api/http-client'
import type { CreateProjectDTO, UpdateProjectDTO } from '@/types/project'

function handleError(error: unknown, fallback: string) {
  toast.error(error instanceof ApiError ? error.message : fallback)
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProjectDTO) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Proyecto creado')
    },
    onError: (error) => handleError(error, 'No se pudo crear el proyecto'),
  })
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateProjectDTO) => projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project', id] })
      toast.success('Proyecto actualizado')
    },
    onError: (error) => handleError(error, 'No se pudo actualizar el proyecto'),
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => projectsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Proyecto eliminado')
    },
    onError: (error) => handleError(error, 'No se pudo eliminar el proyecto'),
  })
}
