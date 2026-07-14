import { useQuery } from '@tanstack/react-query'
import { statsApi } from '@/api/stats.api'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['stats', 'dashboard'],
    queryFn: statsApi.getDashboard,
    refetchInterval: 30_000,
  })
}
