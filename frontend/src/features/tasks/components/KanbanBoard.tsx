import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { TASK_STATUSES, type Task, type TaskStatus } from '@/types/task'
import { useUpdateTask } from '../hooks/useTaskMutations'
import { groupByStatus } from '../utils/group-by-status'
import { KanbanColumn } from './KanbanColumn'

interface KanbanBoardProps {
  projectId: string
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}

function isTaskStatus(id: string): id is TaskStatus {
  return (TASK_STATUSES as string[]).includes(id)
}

export function KanbanBoard({ projectId, tasks, onEditTask, onDeleteTask }: KanbanBoardProps) {
  const updateTask = useUpdateTask(projectId)
  const grouped = groupByStatus(tasks)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeTask = tasks.find((t) => t.id === active.id)
    if (!activeTask) return

    const overId = String(over.id)
    const targetStatus = isTaskStatus(overId) ? overId : tasks.find((t) => t.id === overId)?.status

    if (!targetStatus || targetStatus === activeTask.status) return

    updateTask.mutate({ id: activeTask.id, data: { status: targetStatus } })
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={grouped[status]}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </DndContext>
  )
}
