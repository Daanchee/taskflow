import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, httpClient } from './http-client'

function mockFetchOnce(response: { status: number; body?: unknown }) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      status: response.status,
      ok: response.status >= 200 && response.status < 300,
      json: () => Promise.resolve(response.body),
    }),
  )
}

describe('httpClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('retorna el cuerpo parseado cuando la respuesta es exitosa', async () => {
    mockFetchOnce({ status: 200, body: [{ id: '1', name: 'Proyecto' }] })

    const result = await httpClient.get<{ id: string; name: string }[]>('/projects')

    expect(result).toEqual([{ id: '1', name: 'Proyecto' }])
  })

  it('retorna undefined para respuestas 204 sin cuerpo', async () => {
    mockFetchOnce({ status: 204 })

    const result = await httpClient.delete('/projects/1')

    expect(result).toBeUndefined()
  })

  it('lanza ApiError con el mensaje y código del backend cuando la respuesta falla', async () => {
    mockFetchOnce({
      status: 404,
      body: { error: { message: 'Proyecto no encontrado', code: 'NOT_FOUND' } },
    })

    await expect(httpClient.get('/projects/inexistente')).rejects.toMatchObject({
      message: 'Proyecto no encontrado',
      status: 404,
      code: 'NOT_FOUND',
    })
  })

  it('ApiError es instancia de Error', async () => {
    mockFetchOnce({ status: 500, body: { error: { message: 'Error interno' } } })

    try {
      await httpClient.get('/projects')
      expect.unreachable('debería haber lanzado')
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError)
      expect(error).toBeInstanceOf(Error)
    }
  })
})
