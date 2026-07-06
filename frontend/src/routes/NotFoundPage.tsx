import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-3xl font-semibold text-foreground">404</h1>
      <p className="text-muted-foreground">La página que buscas no existe.</p>
      <Button render={<Link to="/" />}>Volver al inicio</Button>
    </div>
  )
}
