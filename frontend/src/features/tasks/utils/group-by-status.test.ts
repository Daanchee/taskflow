import { describe, expect, it } from 'vitest'
import { groupByStatus } from './group-by-status'
import type { Task } from '@/types/task'

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: crypto.randomUUID(),
    projectId: 'project-1',
    title: 'Tarea',
    status: 'TODO',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('groupByStatus', () => {
  it('agrupa las tareas por status en las 3 columnas', () => {
    const tasks = [
      makeTask({ id: '1', status: 'TODO' }),
      makeTask({ id: '2', status: 'IN_PROGRESS' }),
      makeTask({ id: '3', status: 'DONE' }),
      makeTask({ id: '4', status: 'TODO' }),
    ]

    const grouped = groupByStatus(tasks)

    expect(grouped.TODO).toHaveLength(2)
    expect(grouped.IN_PROGRESS).toHaveLength(1)
    expect(grouped.DONE).toHaveLength(1)
  })

  it('retorna las 3 columnas vacías cuando no hay tareas', () => {
    const grouped = groupByStatus([])

    expect(grouped).toEqual({ TODO: [], IN_PROGRESS: [], DONE: [] })
  })

  it('preserva el orden original de las tareas dentro de cada columna', () => {
    const tasks = [
      makeTask({ id: '1', status: 'TODO', title: 'Primera' }),
      makeTask({ id: '2', status: 'TODO', title: 'Segunda' }),
    ]

    const grouped = groupByStatus(tasks)

    expect(grouped.TODO.map((t) => t.title)).toEqual(['Primera', 'Segunda'])
  })
})
