import type { Task, TaskStatus } from '@/types/task'

export function groupByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const grouped = {
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  } as Record<TaskStatus, Task[]>

  for (const task of tasks) {
    grouped[task.status].push(task)
  }

  return grouped
}
