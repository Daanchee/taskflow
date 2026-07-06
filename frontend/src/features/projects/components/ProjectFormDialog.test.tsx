import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor } from '@/test/test-utils'
import { ProjectFormDialog } from './ProjectFormDialog'
import { projectsApi } from '@/api/projects.api'
import type { Project } from '@/types/project'

vi.mock('@/api/projects.api', () => ({
  projectsApi: {
    create: vi.fn(),
    update: vi.fn(),
  },
}))

const existingProject: Project = {
  id: '1',
  name: 'Proyecto existente',
  description: 'Descripción existente',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('ProjectFormDialog', () => {
  it('muestra un error de validación si se envía el formulario sin nombre', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProjectFormDialog open onOpenChange={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Crear proyecto' }))

    expect(await screen.findByText('El nombre es obligatorio')).toBeInTheDocument()
    expect(projectsApi.create).not.toHaveBeenCalled()
  })

  it('crea el proyecto con los datos del formulario', async () => {
    vi.mocked(projectsApi.create).mockResolvedValue(existingProject)
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    renderWithProviders(<ProjectFormDialog open onOpenChange={onOpenChange} />)

    await user.type(screen.getByLabelText('Nombre'), 'Nuevo proyecto')
    await user.click(screen.getByRole('button', { name: 'Crear proyecto' }))

    await waitFor(() => {
      expect(projectsApi.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Nuevo proyecto' }),
      )
    })
  })

  it('precarga los datos del proyecto cuando está en modo edición', () => {
    renderWithProviders(<ProjectFormDialog open onOpenChange={vi.fn()} project={existingProject} />)

    expect(screen.getByDisplayValue('Proyecto existente')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
  })
})
