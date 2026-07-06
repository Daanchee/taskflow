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
import { useDeleteTask } from '../hooks/useTaskMutations'
import type { Task } from '@/types/task'

interface DeleteTaskDialogProps {
  task: Task | null
  projectId: string
  onOpenChange: (open: boolean) => void
}

export function DeleteTaskDialog({ task, projectId, onOpenChange }: DeleteTaskDialogProps) {
  const deleteTask = useDeleteTask(projectId)

  const handleConfirm = async () => {
    if (!task) return
    await deleteTask.mutateAsync(task.id)
    onOpenChange(false)
  }

  return (
    <AlertDialog open={Boolean(task)} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar «{task?.title}»?</AlertDialogTitle>
          <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
