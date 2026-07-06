import { Router } from 'express';

export function createHealthRouter(): Router {
  const router = Router();

  /**
   * @openapi
   * /health:
   *   get:
   *     summary: Healthcheck del servicio
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: El servicio está operativo
   */
  router.get('/', (_req, res) => {
    res.json({ status: 'ok' });
  });

  return router;
}
