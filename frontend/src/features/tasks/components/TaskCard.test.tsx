import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { DndContext } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { renderWithProviders, screen } from '@/test/test-utils'
import { TaskCard } from './TaskCard'
import type { Task } from '@/types/task'

const task: Task = {
  id: 'task-1',
  projectId: 'project-1',
  title: 'Diseñar arquitectura',
  status: 'TODO',
  priority: 'HIGH',
  dueDate: '2026-08-15T12:00:00.000Z',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

function renderTaskCard(overrides: Partial<Task> = {}, onEdit = vi.fn(), onDelete = vi.fn()) {
  return renderWithProviders(
    <DndContext>
      <SortableContext items={[task.id]}>
        <TaskCard task={{ ...task, ...overrides }} onEdit={onEdit} onDelete={onDelete} />
      </SortableContext>
    </DndContext>,
  )
}

describe('TaskCard', () => {
  it('muestra el título y la etiqueta de prioridad', () => {
    renderTaskCard()

    expect(screen.getByText('Diseñar arquitectura')).toBeInTheDocument()
    expect(screen.getByText('Alta')).toBeInTheDocument()
  })

  it('muestra la fecha límite formateada cuando existe', () => {
    renderTaskCard()

    expect(screen.getByText('15/08/2026')).toBeInTheDocument()
  })

  it('no muestra fecha cuando la tarea no tiene dueDate', () => {
    renderTaskCard({ dueDate: undefined })

    expect(screen.queryByText(/\d{2}\/\d{2}\/\d{4}/)).not.toBeInTheDocument()
  })

  it('llama a onEdit al hacer click en "Editar" del menú', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    renderTaskCard({}, onEdit)

    await user.click(screen.getByRole('button', { name: 'Opciones de la tarea' }))
    await user.click(await screen.findByText('Editar'))

    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 'task-1' }))
  })
})
