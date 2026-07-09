import { beforeEach, describe, expect, it } from 'vitest';
import { InMemorySessionRepository } from '../../../src/repositories/in-memory/in-memory-session.repository.js';

describe('InMemorySessionRepository', () => {
  let repo: InMemorySessionRepository;

  beforeEach(() => {
    repo = new InMemorySessionRepository();
  });

  it('crea una sesión con un token único y la marca como existente', async () => {
    const session = await repo.create();

    expect(session.token).toBeTruthy();
    expect(await repo.exists(session.token)).toBe(true);
  });

  it('genera tokens distintos en cada creación', async () => {
    const first = await repo.create();
    const second = await repo.create();

    expect(first.token).not.toBe(second.token);
  });

  it('retorna false para un token que no existe', async () => {
    expect(await repo.exists('token-inexistente')).toBe(false);
  });

  it('elimina una sesión existente', async () => {
    const session = await repo.create();

    await repo.delete(session.token);

    expect(await repo.exists(session.token)).toBe(false);
  });

  it('eliminar un token inexistente no lanza error', async () => {
    await expect(repo.delete('token-inexistente')).resolves.not.toThrow();
  });
});
