import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteProject } from '../hooks/useProjectMutations'
import type { Project } from '@/types/project'

interface DeleteProjectDialogProps {
  project: Project | null
  onOpenChange: (open: boolean) => void
}

export function DeleteProjectDialog({ project, onOpenChange }: DeleteProjectDialogProps) {
  const deleteProject = useDeleteProject()

  const handleConfirm = async () => {
    if (!project) return
    await deleteProject.mutateAsync(project.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={Boolean(project)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar «{project?.name}»?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará el proyecto y todas sus tareas de forma permanente. No se puede
            deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
