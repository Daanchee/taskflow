import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: authApi.me,
    retry: false,
  })
}
