import { Link } from 'react-router-dom'
import { KanbanSquare } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <KanbanSquare className="h-5 w-5" />
          TaskFlow
        </Link>
      </div>
    </header>
  )
}
