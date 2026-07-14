import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { ProjectController } from '../controllers/project.controller.js';
import { TaskController } from '../controllers/task.controller.js';
import { StatsController } from '../controllers/stats.controller.js';
import { AuthService } from '../services/auth.service.js';
import { ProjectService } from '../services/project.service.js';
import { TaskService } from '../services/task.service.js';
import { StatsService } from '../services/stats.service.js';
import { createRequireAuthMiddleware } from '../middlewares/require-auth.middleware.js';
import type { Repositories } from '../repositories/index.js';
import { createAuthRouter } from './auth.routes.js';
import { createProjectRouter } from './project.routes.js';
import { createTaskRouter } from './task.routes.js';
import { createStatsRouter } from './stats.routes.js';

export function createApiRouter(repositories: Repositories): Router {
  const { projectRepository, taskRepository, sessionRepository } = repositories;

  const authService = new AuthService(sessionRepository);
  const projectService = new ProjectService(projectRepository, taskRepository);
  const taskService = new TaskService(taskRepository, projectRepository);
  const statsService = new StatsService(taskRepository, projectRepository);

  const authController = new AuthController(authService);
  const projectController = new ProjectController(projectService);
  const taskController = new TaskController(taskService);
  const statsController = new StatsController(statsService);

  const requireAuth = createRequireAuthMiddleware(authService);

  const router = Router();
  router.use('/auth', createAuthRouter(authController, requireAuth));
  router.use('/projects', requireAuth, createProjectRouter(projectController));
  router.use('/stats', requireAuth, createStatsRouter(statsController));
  router.use('/', requireAuth, createTaskRouter(taskController));

  return router;
}
