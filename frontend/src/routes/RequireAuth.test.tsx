import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './RequireAuth'
import { authApi } from '@/api/auth.api'

vi.mock('@/api/auth.api', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
  },
}))

function renderWithRouter() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<div>Tablero protegido</div>} />
          </Route>
          <Route path="/login" element={<div>Pantalla de login</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('RequireAuth', () => {
  it('redirige a /login sin sesión activa', async () => {
    vi.mocked(authApi.me).mockRejectedValue(new Error('401'))

    renderWithRouter()

    expect(await screen.findByText('Pantalla de login')).toBeInTheDocument()
  })

  it('renderiza el contenido protegido con sesión válida', async () => {
    vi.mocked(authApi.me).mockResolvedValue({ username: 'admin' })

    renderWithRouter()

    expect(await screen.findByText('Tablero protegido')).toBeInTheDocument()
  })
})
