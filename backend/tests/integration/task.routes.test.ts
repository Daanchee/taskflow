import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../../src/app.js';
import { createRepositories } from '../../src/repositories/index.js';

describe('Task routes', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp(createRepositories());
  });

  async function createProject(name = 'Proyecto de prueba') {
    const res = await request(app).post('/api/projects').send({ name });
    return res.body as { id: string };
  }

  it('POST /api/projects/:projectId/tasks crea una tarea', async () => {
    const project = await createProject();

    const res = await request(app)
      .post(`/api/projects/${project.id}/tasks`)
      .send({ title: 'Diseñar arquitectura', priority: 'HIGH' });

    expect(res.status).toBe(201);
    expect(res.body.projectId).toBe(project.id);
    expect(res.body.status).toBe('TODO');
  });

  it('POST tasks en un proyecto inexistente retorna 404', async () => {
    const res = await request(app)
      .post('/api/projects/11111111-1111-1111-1111-111111111111/tasks')
      .send({ title: 'X' });

    expect(res.status).toBe(404);
  });

  it('GET tasks filtra por status', async () => {
    const project = await createProject();
    await request(app).post(`/api/projects/${project.id}/tasks`).send({ title: 'A' });
    const doneTask = await request(app)
      .post(`/api/projects/${project.id}/tasks`)
      .send({ title: 'B', status: 'DONE' });

    const res = await request(app).get(`/api/projects/${project.id}/tasks?status=DONE`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe(doneTask.body.id);
  });

  it('PUT /api/tasks/:id mueve una tarea de status (kanban drag&drop)', async () => {
    const project = await createProject();
    const task = await request(app)
      .post(`/api/projects/${project.id}/tasks`)
      .send({ title: 'Mover' });

    const res = await request(app)
      .put(`/api/tasks/${task.body.id}`)
      .send({ status: 'IN_PROGRESS' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('IN_PROGRESS');
  });

  it('al eliminar el proyecto, sus tareas dejan de existir (cascada)', async () => {
    const project = await createProject();
    const task = await request(app).post(`/api/projects/${project.id}/tasks`).send({ title: 'X' });

    await request(app).delete(`/api/projects/${project.id}`);

    const res = await request(app).get(`/api/tasks/${task.body.id}`);
    expect(res.status).toBe(404);
  });

  it('DELETE /api/tasks/:id elimina una tarea', async () => {
    const project = await createProject();
    const task = await request(app).post(`/api/projects/${project.id}/tasks`).send({ title: 'X' });

    const res = await request(app).delete(`/api/tasks/${task.body.id}`);
    expect(res.status).toBe(204);
  });
});
