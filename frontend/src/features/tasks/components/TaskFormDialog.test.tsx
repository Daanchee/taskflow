import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor } from '@/test/test-utils'
import { TaskFormDialog } from './TaskFormDialog'
import { tasksApi } from '@/api/tasks.api'

vi.mock('@/api/tasks.api', () => ({
  tasksApi: {
    create: vi.fn(),
    update: vi.fn(),
  },
}))

describe('TaskFormDialog', () => {
  it('muestra las etiquetas en español de estado y prioridad por defecto (no el valor crudo)', () => {
    renderWithProviders(<TaskFormDialog open onOpenChange={vi.fn()} projectId="project-1" />)

    // Regresión: el Select de Base UI mostraba "TODO"/"MEDIUM" en crudo si no se
    // le pasaba una función children a SelectValue.
    expect(screen.getByText('Por hacer')).toBeInTheDocument()
    expect(screen.getByText('Media')).toBeInTheDocument()
    expect(screen.queryByText('TODO')).not.toBeInTheDocument()
    expect(screen.queryByText('MEDIUM')).not.toBeInTheDocument()
  })

  it('muestra un error de validación si se envía sin título', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TaskFormDialog open onOpenChange={vi.fn()} projectId="project-1" />)

    await user.click(screen.getByRole('button', { name: 'Crear tarea' }))

    expect(await screen.findByText('El título es obligatorio')).toBeInTheDocument()
    expect(tasksApi.create).not.toHaveBeenCalled()
  })

  it('crea la tarea con los datos del formulario', async () => {
    vi.mocked(tasksApi.create).mockResolvedValue({
      id: '1',
      projectId: 'project-1',
      title: 'Nueva tarea',
      status: 'TODO',
      priority: 'MEDIUM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    const user = userEvent.setup()
    renderWithProviders(<TaskFormDialog open onOpenChange={vi.fn()} projectId="project-1" />)

    await user.type(screen.getByLabelText('Título'), 'Nueva tarea')
    await user.click(screen.getByRole('button', { name: 'Crear tarea' }))

    await waitFor(() => {
      expect(tasksApi.create).toHaveBeenCalledWith(
        'project-1',
        expect.objectContaining({ title: 'Nueva tarea', status: 'TODO', priority: 'MEDIUM' }),
      )
    })
  })
})
