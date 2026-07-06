import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { ProjectCard } from '@/features/projects/components/ProjectCard'
import { ProjectFormDialog } from '@/features/projects/components/ProjectFormDialog'
import { DeleteProjectDialog } from '@/features/projects/components/DeleteProjectDialog'
import type { Project } from '@/types/project'

export function ProjectsListPage() {
  const [search, setSearch] = useState('')
  const { data: projects, isLoading, isError } = useProjects(search || undefined)

  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)

  const openCreateForm = () => {
    setEditingProject(undefined)
    setFormOpen(true)
  }

  const openEditForm = (project: Project) => {
    setEditingProject(project)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Proyectos</h1>
          <p className="text-sm text-muted-foreground">
            Organiza tu trabajo en proyectos y gestiona sus tareas en un tablero Kanban.
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo proyecto
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar proyectos…"
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && <LoadingSpinner label="Cargando proyectos…" />}
      {isError && <ErrorState message="No se pudieron cargar los proyectos." />}

      {projects && projects.length === 0 && (
        <EmptyState
          title="Todavía no tienes proyectos"
          description="Crea tu primer proyecto para empezar a organizar tareas."
          action={
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Crear proyecto
            </Button>
          }
        />
      )}

      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={openEditForm}
              onDelete={setDeletingProject}
            />
          ))}
        </div>
      )}

      <ProjectFormDialog open={formOpen} onOpenChange={setFormOpen} project={editingProject} />
      <DeleteProjectDialog
        project={deletingProject}
        onOpenChange={() => setDeletingProject(null)}
      />
    </div>
  )
}
