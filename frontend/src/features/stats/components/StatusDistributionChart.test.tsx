import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import { StatusDistributionChart } from './StatusDistributionChart'

describe('StatusDistributionChart', () => {
  it('muestra las etiquetas de estado con sus conteos', () => {
    renderWithProviders(
      <StatusDistributionChart byStatus={{ TODO: 5, IN_PROGRESS: 3, DONE: 12 }} />,
    )

    expect(screen.getByText('Por hacer')).toBeInTheDocument()
    expect(screen.getByText('En progreso')).toBeInTheDocument()
    expect(screen.getByText('Hecho')).toBeInTheDocument()
  })
})
