import { httpClient } from './http-client'
import type { DashboardStats } from '@/types/stats'

export const statsApi = {
  getDashboard: () => httpClient.get<DashboardStats>('/stats/dashboard'),
}
