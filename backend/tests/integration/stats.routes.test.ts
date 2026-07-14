import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../../src/app.js';
import { createRepositories } from '../../src/repositories/index.js';

describe('Stats routes', () => {
  let app: Express;
  let agent: ReturnType<typeof request.agent>;

  beforeEach(async () => {
    app = createApp(createRepositories());
    agent = request.agent(app);
    await agent.post('/api/auth/login').send({ username: 'admin', password: 'test-admin-password' });
  });

  async function createProject(name = 'Proyecto de prueba') {
    const res = await agent.post('/api/projects').send({ name });
    return res.body as { id: string; name: string };
  }

  it('GET /api/stats/dashboard sin sesión retorna 401', async () => {
    const res = await request(app).get('/api/stats/dashboard');
    expect(res.status).toBe(401);
  });

  it('GET /api/stats/dashboard con el sistema vacío retorna conteos en 0', async () => {
    const res = await agent.get('/api/stats/dashboard');

    expect(res.status).toBe(200);
    expect(res.body.byStatus).toEqual({ TODO: 0, IN_PROGRESS: 0, DONE: 0 });
    expect(res.body.byProject).toEqual([]);
    expect(res.body.completedTrend).toHaveLength(30);
  });

  it('GET /api/stats/dashboard agrega datos reales de tareas y proyectos', async () => {
    const project = await createProject();
    await agent.post(`/api/projects/${project.id}/tasks`).send({ title: 'A', priority: 'HIGH' });
    await agent
      .post(`/api/projects/${project.id}/tasks`)
      .send({ title: 'B', status: 'DONE', priority: 'LOW' });

    const res = await agent.get('/api/stats/dashboard');

    expect(res.status).toBe(200);
    expect(res.body.byStatus).toEqual({ TODO: 1, IN_PROGRESS: 0, DONE: 1 });
    expect(res.body.byProject).toEqual([
      { projectId: project.id, projectName: project.name, taskCount: 2 },
    ]);
  });
});
