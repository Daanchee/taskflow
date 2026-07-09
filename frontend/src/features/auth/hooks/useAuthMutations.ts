import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authApi } from '@/api/auth.api'
import { ApiError } from '@/api/http-client'
import type { LoginPayload } from '@/types/auth'

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (session) => {
      queryClient.setQueryData(['session'], session)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(['session'], null)
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'No se pudo cerrar sesión')
    },
  })
}
