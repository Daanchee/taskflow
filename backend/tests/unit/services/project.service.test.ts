import { beforeEach, describe, expect, it } from 'vitest';
import { ProjectService } from '../../../src/services/project.service.js';
import { InMemoryProjectRepository } from '../../../src/repositories/in-memory/in-memory-project.repository.js';
import { InMemoryTaskRepository } from '../../../src/repositories/in-memory/in-memory-task.repository.js';
import { NotFoundError } from '../../../src/errors/app-error.js';

describe('ProjectService', () => {
  let service: ProjectService;
  let projectRepository: InMemoryProjectRepository;
  let taskRepository: InMemoryTaskRepository;

  beforeEach(() => {
    projectRepository = new InMemoryProjectRepository();
    taskRepository = new InMemoryTaskRepository();
    service = new ProjectService(projectRepository, taskRepository);
  });

  it('lanza NotFoundError al obtener un proyecto inexistente', async () => {
    await expect(service.getProject('no-existe')).rejects.toThrow(NotFoundError);
  });

  it('crea un proyecto correctamente', async () => {
    const project = await service.createProject({ name: 'TaskFlow' });
    expect(project.name).toBe('TaskFlow');
  });

  it('al eliminar un proyecto, elimina también sus tareas (cascada)', async () => {
    const project = await service.createProject({ name: 'Con tareas' });
    await taskRepository.create(project.id, { title: 'T1', status: 'TODO', priority: 'LOW' });
    await taskRepository.create(project.id, { title: 'T2', status: 'TODO', priority: 'LOW' });

    await service.deleteProject(project.id);

    const remainingTasks = await taskRepository.findByProjectId(project.id);
    expect(remainingTasks).toHaveLength(0);
    await expect(service.getProject(project.id)).rejects.toThrow(NotFoundError);
  });

  it('lanza NotFoundError al eliminar un proyecto inexistente', async () => {
    await expect(service.deleteProject('no-existe')).rejects.toThrow(NotFoundError);
  });
});
