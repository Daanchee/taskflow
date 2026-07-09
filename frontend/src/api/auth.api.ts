import { httpClient } from './http-client'
import type { LoginPayload, Session } from '@/types/auth'

export const authApi = {
  login: (payload: LoginPayload) => httpClient.post<Session>('/auth/login', payload),
  logout: () => httpClient.post<void>('/auth/logout'),
  me: () => httpClient.get<Session>('/auth/me'),
}
