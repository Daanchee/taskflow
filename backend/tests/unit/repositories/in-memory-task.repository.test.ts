import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryTaskRepository } from '../../../src/repositories/in-memory/in-memory-task.repository.js';

describe('InMemoryTaskRepository', () => {
  let repo: InMemoryTaskRepository;
  const projectId = '11111111-1111-1111-1111-111111111111';

  beforeEach(() => {
    repo = new InMemoryTaskRepository();
  });

  it('crea una tarea asociada a un proyecto', async () => {
    const task = await repo.create(projectId, {
      title: 'Diseñar API',
      status: 'TODO',
      priority: 'HIGH',
    });

    expect(task.id).toBeDefined();
    expect(task.projectId).toBe(projectId);
    expect(task.title).toBe('Diseñar API');
  });

  it('filtra tareas por status y priority', async () => {
    await repo.create(projectId, { title: 'A', status: 'TODO', priority: 'LOW' });
    await repo.create(projectId, { title: 'B', status: 'DONE', priority: 'HIGH' });

    const result = await repo.findByProjectId(projectId, { status: 'DONE' });
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe('B');
  });

  it('filtra tareas por búsqueda de texto', async () => {
    await repo.create(projectId, { title: 'Configurar CI', status: 'TODO', priority: 'MEDIUM' });
    await repo.create(projectId, { title: 'Otra tarea', status: 'TODO', priority: 'MEDIUM' });

    const result = await repo.findByProjectId(projectId, { search: 'ci' });
    expect(result).toHaveLength(1);
  });

  it('elimina todas las tareas de un proyecto', async () => {
    await repo.create(projectId, { title: 'A', status: 'TODO', priority: 'LOW' });
    await repo.create(projectId, { title: 'B', status: 'TODO', priority: 'LOW' });

    await repo.deleteByProjectId(projectId);

    const result = await repo.findByProjectId(projectId);
    expect(result).toHaveLength(0);
  });

  it('retorna null al actualizar una tarea inexistente', async () => {
    const result = await repo.update('no-existe', { title: 'X' });
    expect(result).toBeNull();
  });

  it('findAll trae las tareas de todos los proyectos', async () => {
    const otherProjectId = '22222222-2222-2222-2222-222222222222';
    await repo.create(projectId, { title: 'A', status: 'TODO', priority: 'LOW' });
    await repo.create(otherProjectId, { title: 'B', status: 'TODO', priority: 'LOW' });

    const result = await repo.findAll();
    expect(result).toHaveLength(2);
  });

  it('fija completedAt la primera vez que una tarea pasa a DONE', async () => {
    const task = await repo.create(projectId, { title: 'A', status: 'TODO', priority: 'LOW' });
    expect(task.completedAt).toBeUndefined();

    const updated = await repo.update(task.id, { status: 'DONE' });
    expect(updated?.completedAt).toBeDefined();
  });

  it('no sobrescribe completedAt si la tarea sale y vuelve a entrar a DONE', async () => {
    const task = await repo.create(projectId, { title: 'A', status: 'TODO', priority: 'LOW' });
    const firstDone = await repo.update(task.id, { status: 'DONE' });
    const backToProgress = await repo.update(task.id, { status: 'IN_PROGRESS' });
    const secondDone = await repo.update(task.id, { status: 'DONE' });

    expect(backToProgress?.completedAt).toBe(firstDone?.completedAt);
    expect(secondDone?.completedAt).toBe(firstDone?.completedAt);
  });

  it('fija completedAt si una tarea se crea directamente en DONE', async () => {
    const task = await repo.create(projectId, { title: 'A', status: 'DONE', priority: 'LOW' });
    expect(task.completedAt).toBeDefined();
  });
});
