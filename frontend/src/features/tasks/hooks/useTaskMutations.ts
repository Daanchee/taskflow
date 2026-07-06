import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { tasksApi } from '@/api/tasks.api'
import { ApiError } from '@/api/http-client'
import type { CreateTaskDTO, Task, UpdateTaskDTO } from '@/types/task'

function handleError(error: unknown, fallback: string) {
  toast.error(error instanceof ApiError ? error.message : fallback)
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskDTO) => tasksApi.create(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      toast.success('Tarea creada')
    },
    onError: (error) => handleError(error, 'No se pudo crear la tarea'),
  })
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskDTO }) => tasksApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] })
      const previous = queryClient.getQueriesData<Task[]>({ queryKey: ['tasks', projectId] })

      queryClient.setQueriesData<Task[]>({ queryKey: ['tasks', projectId] }, (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...data } : task)),
      )

      return { previous }
    },
    onError: (error, _vars, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data)
      })
      handleError(error, 'No se pudo actualizar la tarea')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    },
  })
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tasksApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      toast.success('Tarea eliminada')
    },
    onError: (error) => handleError(error, 'No se pudo eliminar la tarea'),
  })
}
