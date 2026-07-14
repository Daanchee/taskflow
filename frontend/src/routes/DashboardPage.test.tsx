import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import { DashboardPage } from './DashboardPage'
import { statsApi } from '@/api/stats.api'
import type { DashboardStats } from '@/types/stats'

vi.mock('@/api/stats.api', () => ({
  statsApi: { getDashboard: vi.fn() },
}))

const populatedStats: DashboardStats = {
  byStatus: { TODO: 2, IN_PROGRESS: 1, DONE: 3 },
  byPriority: { LOW: 1, MEDIUM: 2, HIGH: 3 },
  byProject: [{ projectId: 'p1', projectName: 'Website Redesign', taskCount: 6 }],
  completedTrend: [{ date: '2026-07-14', count: 3 }],
}

describe('DashboardPage', () => {
  it('muestra el spinner mientras carga', () => {
    vi.mocked(statsApi.getDashboard).mockReturnValue(new Promise(() => {}))

    renderWithProviders(<DashboardPage />)

    expect(screen.getByText('Cargando…')).toBeInTheDocument()
  })

  it('muestra un error si la carga falla', async () => {
    vi.mocked(statsApi.getDashboard).mockRejectedValue(new Error('falló'))

    renderWithProviders(<DashboardPage />)

    expect(await screen.findByText(/no se pudieron cargar/i)).toBeInTheDocument()
  })

  it('muestra un estado vacío cuando no hay proyectos ni tareas', async () => {
    vi.mocked(statsApi.getDashboard).mockResolvedValue({
      byStatus: { TODO: 0, IN_PROGRESS: 0, DONE: 0 },
      byPriority: { LOW: 0, MEDIUM: 0, HIGH: 0 },
      byProject: [],
      completedTrend: [],
    })

    renderWithProviders(<DashboardPage />)

    expect(await screen.findByText(/todavía no hay datos/i)).toBeInTheDocument()
  })

  it('muestra los gráficos cuando hay datos', async () => {
    vi.mocked(statsApi.getDashboard).mockResolvedValue(populatedStats)

    renderWithProviders(<DashboardPage />)

    expect(await screen.findByText('Website Redesign')).toBeInTheDocument()
  })
})
