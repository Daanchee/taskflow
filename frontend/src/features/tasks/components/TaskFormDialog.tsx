import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateTask, useUpdateTask } from '../hooks/useTaskMutations'
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS, TASK_STATUSES, type Task } from '@/types/task'

const taskFormSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').max(120),
  description: z.string().max(1000).optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  task?: Task
}

export function TaskFormDialog({ open, onOpenChange, projectId, task }: TaskFormDialogProps) {
  const isEditing = Boolean(task)
  const createTask = useCreateTask(projectId)
  const updateTask = useUpdateTask(projectId)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' },
  })

  useEffect(() => {
    if (open) {
      reset({
        title: task?.title ?? '',
        description: task?.description ?? '',
        status: task?.status ?? 'TODO',
        priority: task?.priority ?? 'MEDIUM',
        dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
      })
    }
  }, [open, task, reset])

  const onSubmit = async (values: TaskFormValues) => {
    const dueDate = values.dueDate ? new Date(values.dueDate).toISOString() : undefined
    const payload = { ...values, dueDate }

    if (isEditing && task) {
      await updateTask.mutateAsync({ id: task.id, data: payload })
    } else {
      await createTask.mutateAsync(payload)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar tarea' : 'Nueva tarea'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Ej. Diseñar la landing page" {...register('title')} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción opcional"
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue>
                        {(value: string) =>
                          TASK_STATUS_LABELS[value as keyof typeof TASK_STATUS_LABELS]
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {TASK_STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue>
                        {(value: string) =>
                          TASK_PRIORITY_LABELS[value as keyof typeof TASK_PRIORITY_LABELS]
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Fecha límite</Label>
            <Input id="dueDate" type="date" {...register('dueDate')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? 'Guardar cambios' : 'Crear tarea'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
