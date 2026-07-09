import { Router, type RequestHandler } from 'express';
import type { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../utils/async-handler.js';
import { loginSchema } from '../schemas/auth.schema.js';

export function createAuthRouter(controller: AuthController, requireAuth: RequestHandler): Router {
  const router = Router();

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: Inicia sesión con usuario y contraseña
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [username, password]
   *             properties:
   *               username: { type: string }
   *               password: { type: string }
   *     responses:
   *       200:
   *         description: Login exitoso, la cookie de sesión queda seteada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 username: { type: string }
   *       401:
   *         description: Usuario o contraseña incorrectos
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Error' }
   */
  router.post('/login', validate(loginSchema, 'body'), asyncHandler(controller.login));

  /**
   * @openapi
   * /auth/logout:
   *   post:
   *     summary: Cierra la sesión activa (idempotente)
   *     tags: [Auth]
   *     responses:
   *       204:
   *         description: Sesión cerrada
   */
  router.post('/logout', asyncHandler(controller.logout));

  /**
   * @openapi
   * /auth/me:
   *   get:
   *     summary: Retorna la sesión activa
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Sesión válida
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 username: { type: string }
   *       401:
   *         description: No hay sesión activa
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Error' }
   */
  router.get('/me', requireAuth, asyncHandler(controller.me));

  return router;
}
