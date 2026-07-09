import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor } from '@/test/test-utils'
import { LoginForm } from './LoginForm'
import { authApi } from '@/api/auth.api'
import { ApiError } from '@/api/http-client'

vi.mock('@/api/auth.api', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
  },
}))

describe('LoginForm', () => {
  it('muestra errores de validación si se envía vacío', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByText('El usuario es obligatorio')).toBeInTheDocument()
    expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument()
    expect(authApi.login).not.toHaveBeenCalled()
  })

  it('envía las credenciales ingresadas al hacer submit', async () => {
    vi.mocked(authApi.login).mockResolvedValue({ username: 'admin' })
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('Usuario'), 'admin')
    await user.type(screen.getByLabelText('Contraseña'), '312')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({ username: 'admin', password: '312' })
    })
  })

  it('muestra un mensaje de error genérico con credenciales incorrectas', async () => {
    vi.mocked(authApi.login).mockRejectedValue(
      new ApiError('Usuario o contraseña incorrectos', 401, 'UNAUTHORIZED'),
    )
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('Usuario'), 'admin')
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByText('Usuario o contraseña incorrectos')).toBeInTheDocument()
  })
})
