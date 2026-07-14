import { Router } from 'express';
import type { StatsController } from '../controllers/stats.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

export function createStatsRouter(controller: StatsController): Router {
  const router = Router();

  /**
   * @openapi
   * /stats/dashboard:
   *   get:
   *     summary: Métricas agregadas para el dashboard (tareas por estado/prioridad/proyecto y tendencia de completadas)
   *     tags: [Stats]
   *     responses:
   *       200:
   *         description: Métricas agregadas
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/DashboardStats' }
   *       401:
   *         description: Sin sesión activa
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Error' }
   */
  router.get('/dashboard', asyncHandler(controller.getDashboardStats));

  return router;
}
