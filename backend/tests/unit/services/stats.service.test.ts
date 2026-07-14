import { beforeEach, describe, expect, it } from 'vitest';
import { StatsService } from '../../../src/services/stats.service.js';
import { InMemoryProjectRepository } from '../../../src/repositories/in-memory/in-memory-project.repository.js';
import { InMemoryTaskRepository } from '../../../src/repositories/in-memory/in-memory-task.repository.js';

describe('StatsService', () => {
  let service: StatsService;
  let projectRepository: InMemoryProjectRepository;
  let taskRepository: InMemoryTaskRepository;

  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository();
    taskRepository = new InMemoryTaskRepository();
    service = new StatsService(taskRepository, projectRepository);
  });

  it('devuelve conteos en 0 y sin proyectos cuando el sistema está vacío', async () => {
    const stats = await service.getDashboardStats();

    expect(stats.byStatus).toEqual({ TODO: 0, IN_PROGRESS: 0, DONE: 0 });
    expect(stats.byPriority).toEqual({ LOW: 0, MEDIUM: 0, HIGH: 0 });
    expect(stats.byProject).toEqual([]);
    expect(stats.completedTrend).toHaveLength(30);
    expect(stats.completedTrend.every((point) => point.count === 0)).toBe(true);
  });

  it('agrupa tareas por estado y por prioridad', async () => {
    const project = await projectRepository.create({ name: 'Proyecto' });
    await taskRepository.create(project.id, { title: 'A', status: 'TODO', priority: 'LOW' });
    await taskRepository.create(project.id, { title: 'B', status: 'IN_PROGRESS', priority: 'MEDIUM' });
    await taskRepository.create(project.id, { title: 'C', status: 'DONE', priority: 'HIGH' });
    await taskRepository.create(project.id, { title: 'D', status: 'DONE', priority: 'HIGH' });

    const stats = await service.getDashboardStats();

    expect(stats.byStatus).toEqual({ TODO: 1, IN_PROGRESS: 1, DONE: 2 });
    expect(stats.byPriority).toEqual({ LOW: 1, MEDIUM: 1, HIGH: 2 });
  });

  it('incluye proyectos sin tareas con taskCount 0', async () => {
    const withTasks = await projectRepository.create({ name: 'Con tareas' });
    const empty = await projectRepository.create({ name: 'Sin tareas' });
    await taskRepository.create(withTasks.id, { title: 'A', status: 'TODO', priority: 'LOW' });

    const stats = await service.getDashboardStats();

    expect(stats.byProject).toEqual([
      { projectId: withTasks.id, projectName: 'Con tareas', taskCount: 1 },
      { projectId: empty.id, projectName: 'Sin tareas', taskCount: 0 },
    ]);
  });

  it('la tendencia diaria trae 30 puntos y refleja las tareas completadas hoy', async () => {
    const project = await projectRepository.create({ name: 'Proyecto' });
    await taskRepository.create(project.id, { title: 'A', status: 'DONE', priority: 'LOW' });
    await taskRepository.create(project.id, { title: 'B', status: 'DONE', priority: 'LOW' });
    await taskRepository.create(project.id, { title: 'C', status: 'TODO', priority: 'LOW' });

    const stats = await service.getDashboardStats();
    const today = new Date().toISOString().slice(0, 10);

    expect(stats.completedTrend).toHaveLength(30);
    expect(stats.completedTrend.at(-1)?.date).toBe(today);
    expect(stats.completedTrend.at(-1)?.count).toBe(2);
  });
});
