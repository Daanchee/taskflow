import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/test-utils'
import { ProjectCard } from './ProjectCard'
import type { Project } from '@/types/project'

const project: Project = {
  id: '1',
  name: 'Rediseño de sitio web',
  description: 'Modernizar la landing page',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('ProjectCard', () => {
  it('muestra el nombre y la descripción del proyecto', () => {
    renderWithProviders(<ProjectCard project={project} onEdit={vi.fn()} onDelete={vi.fn()} />)

    expect(screen.getByText('Rediseño de sitio web')).toBeInTheDocument()
    expect(screen.getByText('Modernizar la landing page')).toBeInTheDocument()
  })

  it('muestra "Sin descripción" cuando el proyecto no tiene descripción', () => {
    renderWithProviders(
      <ProjectCard
        project={{ ...project, description: undefined }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('Sin descripción')).toBeInTheDocument()
  })

  it('llama a onEdit al hacer click en "Editar" del menú', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    renderWithProviders(<ProjectCard project={project} onEdit={onEdit} onDelete={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Opciones del proyecto' }))
    await user.click(await screen.findByText('Editar'))

    expect(onEdit).toHaveBeenCalledWith(project)
  })

  it('llama a onDelete al hacer click en "Eliminar" del menú', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    renderWithProviders(<ProjectCard project={project} onEdit={vi.fn()} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: 'Opciones del proyecto' }))
    await user.click(await screen.findByText('Eliminar'))

    expect(onDelete).toHaveBeenCalledWith(project)
  })
})
