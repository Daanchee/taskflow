import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { useProject } from '@/features/projects/hooks/useProject'
import { useTasks } from '@/features/tasks/hooks/useTasks'
import { KanbanBoard } from '@/features/tasks/components/KanbanBoard'
import { TaskFormDialog } from '@/features/tasks/components/TaskFormDialog'
import { DeleteTaskDialog } from '@/features/tasks/components/DeleteTaskDialog'
import { TaskFilters } from '@/features/tasks/components/TaskFilters'
import type { Task, TaskFilters as TaskFiltersType } from '@/types/task'

export function ProjectBoardPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const {
    data: project,
    isLoading: isLoadingProject,
    isError: isProjectError,
  } = useProject(projectId)

  const [filters, setFilters] = useState<TaskFiltersType>({})
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isError: isTasksError,
  } = useTasks(projectId, filters)

  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const openCreateForm = () => {
    setEditingTask(undefined)
    setFormOpen(true)
  }

  const openEditForm = (task: Task) => {
    setEditingTask(task)
    setFormOpen(true)
  }

  if (isLoadingProject) return <LoadingSpinner label="Cargando proyecto…" />
  if (isProjectError || !projectId) return <ErrorState message="No se pudo cargar el proyecto." />

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a proyectos
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{project?.name}</h1>
            {project?.description && (
              <p className="text-sm text-muted-foreground">{project.description}</p>
            )}
          </div>
          <Button onClick={openCreateForm}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva tarea
          </Button>
        </div>
      </div>

      <TaskFilters filters={filters} onChange={setFilters} />

      {isLoadingTasks && <LoadingSpinner label="Cargando tareas…" />}
      {isTasksError && <ErrorState message="No se pudieron cargar las tareas." />}

      {tasks && tasks.length === 0 && (
        <EmptyState
          title="No hay tareas todavía"
          description="Crea la primera tarea de este proyecto."
          action={
            <Button onClick={openCreateForm}>
              <Plus className="mr-2 h-4 w-4" />
              Crear tarea
            </Button>
          }
        />
      )}

      {tasks && tasks.length > 0 && (
        <KanbanBoard
          projectId={projectId}
          tasks={tasks}
          onEditTask={openEditForm}
          onDeleteTask={setDeletingTask}
        />
      )}

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        projectId={projectId}
        task={editingTask}
      />
      <DeleteTaskDialog
        task={deletingTask}
        projectId={projectId}
        onOpenChange={() => setDeletingTask(null)}
      />
    </div>
  )
}
