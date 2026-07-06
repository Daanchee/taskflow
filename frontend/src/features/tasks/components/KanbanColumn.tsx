import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TASK_STATUS_LABELS, type Task, type TaskStatus } from '@/types/task'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}

export function KanbanColumn({ status, tasks, onEditTask, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[300px] flex-col gap-3 rounded-lg border bg-muted/40 p-3 transition-colors ${
        isOver ? 'bg-muted' : ''
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-foreground">{TASK_STATUS_LABELS[status]}</h3>
        <span className="text-xs text-muted-foreground">{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
