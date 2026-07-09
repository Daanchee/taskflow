import { beforeEach, describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '@/test/test-utils'
import { ThemeToggle } from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('arranca en tema claro (según la preferencia de sistema mockeada) y ofrece pasar a oscuro', async () => {
    renderWithProviders(<ThemeToggle />)

    expect(await screen.findByRole('button', { name: 'Cambiar a tema oscuro' })).toBeInTheDocument()
  })

  it('alterna a oscuro al hacer click y deja fijado un valor explícito en localStorage', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ThemeToggle />)

    const button = await screen.findByRole('button', { name: 'Cambiar a tema oscuro' })
    await user.click(button)

    expect(await screen.findByRole('button', { name: 'Cambiar a tema claro' })).toBeInTheDocument()
    expect(window.localStorage.getItem('taskflow-theme')).toBe('dark')
  })

  it('al volver a hacer click, vuelve a claro y nunca fija "system" en localStorage', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ThemeToggle />)

    const button = await screen.findByRole('button', { name: 'Cambiar a tema oscuro' })
    await user.click(button)
    await user.click(await screen.findByRole('button', { name: 'Cambiar a tema claro' }))

    expect(await screen.findByRole('button', { name: 'Cambiar a tema oscuro' })).toBeInTheDocument()
    expect(window.localStorage.getItem('taskflow-theme')).toBe('light')
  })
})
