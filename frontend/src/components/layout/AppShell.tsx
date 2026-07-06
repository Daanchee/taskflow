import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'

export function AppShell() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
