import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../../src/app.js';
import { createRepositories } from '../../src/repositories/index.js';

describe('Project routes', () => {
  let app: Express;
  let agent: ReturnType<typeof request.agent>;

  beforeEach(async () => {
    app = createApp(createRepositories());
    agent = request.agent(app);
    await agent.post('/api/auth/login').send({ username: 'admin', password: 'test-admin-password' });
  });

  it('GET /api/projects retorna lista vacía inicialmente', async () => {
    const res = await agent.get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/projects crea un proyecto', async () => {
    const res = await agent.post('/api/projects').send({ name: 'TaskFlow' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('TaskFlow');
  });

  it('POST /api/projects rechaza body inválido con 400', async () => {
    const res = await agent.post('/api/projects').send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('GET /api/projects/:id retorna 404 si no existe', async () => {
    const res = await agent.get('/api/projects/11111111-1111-1111-1111-111111111111');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('flujo completo: crear, actualizar y eliminar un proyecto', async () => {
    const created = await agent.post('/api/projects').send({ name: 'Original' });
    const id = created.body.id;

    const updated = await agent.put(`/api/projects/${id}`).send({ name: 'Actualizado' });
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('Actualizado');

    const deleted = await agent.delete(`/api/projects/${id}`);
    expect(deleted.status).toBe(204);

    const getAfterDelete = await agent.get(`/api/projects/${id}`);
    expect(getAfterDelete.status).toBe(404);
  });
});
