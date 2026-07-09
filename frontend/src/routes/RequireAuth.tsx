import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '@/features/auth/hooks/useSession'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

export function RequireAuth() {
  const { data, isLoading } = useSession()

  if (isLoading) {
    return <LoadingSpinner label="Verificando sesión…" />
  }

  if (!data) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
