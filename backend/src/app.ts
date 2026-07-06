import cors from 'cors';
import express, { type Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middlewares/error-handler.js';
import { notFoundMiddleware } from './middlewares/not-found.js';
import { createApiRouter } from './routes/index.js';
import { createHealthRouter } from './routes/health.routes.js';
import { createRepositories, type Repositories } from './repositories/index.js';

export function createApp(repositories: Repositories = createRepositories()): Express {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json());

  app.use('/health', createHealthRouter());
  app.use('/api', createApiRouter(repositories));

  app.get('/api-docs.json', (_req, res) => {
    res.json(swaggerSpec);
  });
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(notFoundMiddleware);
  app.use(errorHandler);

  return app;
}
