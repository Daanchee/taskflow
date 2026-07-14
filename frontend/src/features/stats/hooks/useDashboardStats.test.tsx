import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { useDashboardStats } from './useDashboardStats'
import { statsApi } from '@/api/stats.api'
import type { DashboardStats } from '@/types/stats'

vi.mock('@/api/stats.api', () => ({
  statsApi: { getDashboard: vi.fn() },
}))

const emptyStats: DashboardStats = {
  byStatus: { TODO: 0, IN_PROGRESS: 0, DONE: 0 },
  byPriority: { LOW: 0, MEDIUM: 0, HIGH: 0 },
  byProject: [],
  completedTrend: [],
}

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useDashboardStats', () => {
  beforeEach(() => {
    vi.mocked(statsApi.getDashboard).mockReset().mockResolvedValue(emptyStats)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('trae las métricas al montarse', async () => {
    const { result } = renderHook(() => useDashboardStats(), { wrapper })

    await waitFor(() => expect(result.current.data).toEqual(emptyStats))
    expect(statsApi.getDashboard).toHaveBeenCalledTimes(1)
  })

  it('vuelve a pedir las métricas cada 30 segundos (polling de FR-006)', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })

    const { result } = renderHook(() => useDashboardStats(), { wrapper })

    await waitFor(() => expect(result.current.data).toEqual(emptyStats))
    expect(statsApi.getDashboard).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(30_000)

    expect(statsApi.getDashboard).toHaveBeenCalledTimes(2)
  })
})
