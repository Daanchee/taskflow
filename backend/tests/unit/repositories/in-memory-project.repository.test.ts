import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryProjectRepository } from '../../../src/repositories/in-memory/in-memory-project.repository.js';

describe('InMemoryProjectRepository', () => {
  let repo: InMemoryProjectRepository;

  beforeEach(() => {
    repo = new InMemoryProjectRepository();
  });

  it('crea y recupera un proyecto por id', async () => {
    const project = await repo.create({ name: 'TaskFlow' });
    const found = await repo.findById(project.id);

    expect(found).toEqual(project);
  });

  it('filtra proyectos por nombre (case-insensitive)', async () => {
    await repo.create({ name: 'Website Redesign' });
    await repo.create({ name: 'Mobile App' });

    const result = await repo.findAll('website');
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe('Website Redesign');
  });

  it('actualiza un proyecto existente', async () => {
    const project = await repo.create({ name: 'Original' });
    const updated = await repo.update(project.id, { name: 'Actualizado' });

    expect(updated?.name).toBe('Actualizado');
    expect(updated?.updatedAt).not.toBe(project.updatedAt === updated?.createdAt);
  });

  it('elimina un proyecto y retorna false si ya no existe', async () => {
    const project = await repo.create({ name: 'Para borrar' });

    expect(await repo.delete(project.id)).toBe(true);
    expect(await repo.delete(project.id)).toBe(false);
  });
});
