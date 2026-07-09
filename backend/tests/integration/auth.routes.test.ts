import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { createApp } from '../../src/app.js';
import { createRepositories } from '../../src/repositories/index.js';

describe('Auth routes', () => {
  let app: Express;

  beforeEach(() => {
    app = createApp(createRepositories());
  });

  describe('POST /api/auth/login', () => {
    it('retorna 200 y una cookie de sesión con credenciales correctas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'test-admin-password' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ username: 'admin' });

      const setCookie = res.headers['set-cookie'];
      expect(setCookie).toBeDefined();
      const cookie = Array.isArray(setCookie) ? setCookie[0] : setCookie;
      expect(cookie).toContain('taskflow_session=');
      expect(cookie).toMatch(/HttpOnly/i);
      expect(cookie).not.toMatch(/Max-Age/i);
      expect(cookie).not.toMatch(/Expires/i);
    });

    it('retorna 401 con mensaje genérico con usuario incorrecto', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'otro', password: 'test-admin-password' });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('retorna 401 con mensaje genérico con contraseña incorrecta', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'admin', password: 'incorrecta' });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('rechaza body inválido con 400', async () => {
      const res = await request(app).post('/api/auth/login').send({ username: 'admin' });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/auth/me', () => {
    it('retorna 401 sin cookie de sesión', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('retorna 200 con una sesión válida', async () => {
      const agent = request.agent(app);
      await agent.post('/api/auth/login').send({ username: 'admin', password: 'test-admin-password' });

      const res = await agent.get('/api/auth/me');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ username: 'admin' });
    });
  });

  describe('POST /api/auth/logout', () => {
    it('invalida la sesión y limpia la cookie', async () => {
      const agent = request.agent(app);
      await agent.post('/api/auth/login').send({ username: 'admin', password: 'test-admin-password' });

      const logoutRes = await agent.post('/api/auth/logout');
      expect(logoutRes.status).toBe(204);

      const meRes = await agent.get('/api/auth/me');
      expect(meRes.status).toBe(401);
    });

    it('es idempotente sin sesión activa', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(204);
    });
  });

  describe('requireAuth sobre rutas protegidas', () => {
    it('GET /api/projects retorna 401 sin sesión', async () => {
      const res = await request(app).get('/api/projects');
      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('GET /api/projects retorna 200 con sesión válida', async () => {
      const agent = request.agent(app);
      await agent.post('/api/auth/login').send({ username: 'admin', password: 'test-admin-password' });

      const res = await agent.get('/api/projects');

      expect(res.status).toBe(200);
    });

    it('GET /api/projects vuelve a bloquear después de logout', async () => {
      const agent = request.agent(app);
      await agent.post('/api/auth/login').send({ username: 'admin', password: 'test-admin-password' });
      await agent.post('/api/auth/logout');

      const res = await agent.get('/api/projects');

      expect(res.status).toBe(401);
    });
  });
});
