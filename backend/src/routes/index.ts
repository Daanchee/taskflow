import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { TaskController } from '../controllers/task.controller.js';
import { ProjectService } from '../services/project.service.js';
import { TaskService } from '../services/task.service.js';
import type { Repositories } from '../repositories/index.js';
import { createProjectRouter } from './project.routes.js';
import { createTaskRouter } from './task.routes.js';

export function createApiRouter(repositories: Repositories): Router {
  const { projectRepository, taskRepository } = repositories;

  const projectService = new ProjectService(projectRepository, taskRepository);
  const taskService = new TaskService(taskRepository, projectRepository);

  const projectController = new ProjectController(projectService);
  const taskController = new TaskController(taskService);

  const router = Router();
  router.use('/projects', createProjectRouter(projectController));
  router.use('/', createTaskRouter(taskController));

  return router;
}
