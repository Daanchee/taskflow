import { KanbanSquare } from 'lucide-react'
import { LoginForm } from '@/features/auth/components/LoginForm'

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-background p-6 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <KanbanSquare className="h-8 w-8 text-foreground" />
          <h1 className="text-xl font-semibold text-foreground">TaskFlow</h1>
          <p className="text-sm text-muted-foreground">Iniciá sesión para continuar</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
