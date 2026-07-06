import { Link } from 'react-router-dom'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Project } from '@/types/project'

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
        <Link to={`/projects/${project.id}`} className="min-w-0 flex-1">
          <CardTitle className="truncate text-base">{project.name}</CardTitle>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Opciones del proyecto"
            render={<Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" />}
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(project)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(project)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <Link to={`/projects/${project.id}`}>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description || 'Sin descripción'}
          </p>
        </Link>
      </CardContent>
    </Card>
  )
}
