import { beforeEach, describe, expect, it } from 'vitest';
import { TaskService } from '../../../src/services/task.service.js';
import { InMemoryProjectRepository } from '../../../src/repositories/in-memory/in-memory-project.repository.js';
import { InMemoryTaskRepository } from '../../../src/repositories/in-memory/in-memory-task.repository.js';
import { NotFoundError } from '../../../src/errors/app-error.js';

describe('TaskService', () => {
  let service: TaskService;
  let projectRepository: InMemoryProjectRepository;
  let taskRepository: InMemoryTaskRepository;

  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository();
    taskRepository = new InMemoryTaskRepository();
    service = new TaskService(taskRepository, projectRepository);
  });

  it('lanza NotFoundError al crear una tarea en un proyecto inexistente', async () => {
    await expect(
      service.createTask('no-existe', { title: 'X', status: 'TODO', priority: 'LOW' }),
    ).rejects.toThrow(NotFoundError);
  });

  it('crea una tarea dentro de un proyecto existente', async () => {
    const project = await projectRepository.create({ name: 'Proyecto' });
    const task = await service.createTask(project.id, {
      title: 'Nueva tarea',
      status: 'TODO',
      priority: 'MEDIUM',
    });

    expect(task.projectId).toBe(project.id);
  });

  it('lanza NotFoundError al actualizar una tarea inexistente', async () => {
    await expect(service.updateTask('no-existe', { title: 'X' })).rejects.toThrow(NotFoundError);
  });

  it('permite mover una tarea de status (drag & drop del kanban)', async () => {
    const project = await projectRepository.create({ name: 'Proyecto' });
    const task = await taskRepository.create(project.id, {
      title: 'Mover',
      status: 'TODO',
      priority: 'LOW',
    });

    const updated = await service.updateTask(task.id, { status: 'IN_PROGRESS' });
    expect(updated.status).toBe('IN_PROGRESS');
  });
});
