import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TASK_PRIORITY_LABELS, type Task } from '@/types/task'

const PRIORITY_VARIANT: Record<Task['priority'], 'secondary' | 'default' | 'destructive'> = {
  LOW: 'secondary',
  MEDIUM: 'default',
  HIGH: 'destructive',
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} className="cursor-grab touch-none active:cursor-grabbing">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div {...attributes} {...listeners} className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{task.title}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Opciones de la tarea"
            render={<Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" />}
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(task)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2 pb-3">
        <Badge variant={PRIORITY_VARIANT[task.priority]}>
          {TASK_PRIORITY_LABELS[task.priority]}
        </Badge>
        {task.dueDate && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {format(new Date(task.dueDate), 'dd/MM/yyyy')}
          </span>
        )}
      </CardContent>
    </Card>
  )
}
