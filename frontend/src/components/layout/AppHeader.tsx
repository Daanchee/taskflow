import { Link } from 'react-router-dom'
import { KanbanSquare, LayoutDashboard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/features/auth/hooks/useAuthMutations'
import { ThemeToggle } from '@/features/theme/components/ThemeToggle'

export function AppHeader() {
  const logout = useLogout()

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <KanbanSquare className="h-5 w-5" />
          TaskFlow
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link to="/dashboard" />}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}
