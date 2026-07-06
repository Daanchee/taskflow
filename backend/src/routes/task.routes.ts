import { Router } from 'express';
import type { TaskController } from '../controllers/task.controller.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../utils/async-handler.js';
import {
  createTaskSchema,
  projectIdParamSchema,
  taskFiltersQuerySchema,
  taskIdParamSchema,
  updateTaskSchema,
} from '../schemas/task.schema.js';

export function createTaskRouter(controller: TaskController): Router {
  const projectTasksRouter = Router({ mergeParams: true });
  const tasksRouter = Router();

  /**
   * @openapi
   * /projects/{projectId}/tasks:
   *   get:
   *     summary: Lista las tareas de un proyecto (con filtros)
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema: { type: string, format: uuid }
   *       - in: query
   *         name: status
   *         schema: { type: string, enum: [TODO, IN_PROGRESS, DONE] }
   *       - in: query
   *         name: priority
   *         schema: { type: string, enum: [LOW, MEDIUM, HIGH] }
   *       - in: query
   *         name: search
   *         schema: { type: string }
   *       - in: query
   *         name: dueBefore
   *         schema: { type: string, format: date-time }
   *       - in: query
   *         name: dueAfter
   *         schema: { type: string, format: date-time }
   *     responses:
   *       200:
   *         description: Lista de tareas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items: { $ref: '#/components/schemas/Task' }
   *   post:
   *     summary: Crea una tarea dentro de un proyecto
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema: { type: string, format: uuid }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [title]
   *             properties:
   *               title: { type: string }
   *               description: { type: string }
   *               status: { type: string, enum: [TODO, IN_PROGRESS, DONE] }
   *               priority: { type: string, enum: [LOW, MEDIUM, HIGH] }
   *               dueDate: { type: string, format: date-time }
   *     responses:
   *       201:
   *         description: Tarea creada
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Task' }
   */
  projectTasksRouter
    .route('/')
    .get(
      validate(projectIdParamSchema, 'params'),
      validate(taskFiltersQuerySchema, 'query'),
      asyncHandler(controller.listTasks),
    )
    .post(
      validate(projectIdParamSchema, 'params'),
      validate(createTaskSchema, 'body'),
      asyncHandler(controller.createTask),
    );

  /**
   * @openapi
   * /tasks/{id}:
   *   get:
   *     summary: Obtiene una tarea por id
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: Tarea encontrada
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Task' }
   *   put:
   *     summary: Actualiza una tarea (incluye mover de columna vía status)
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title: { type: string }
   *               description: { type: string }
   *               status: { type: string, enum: [TODO, IN_PROGRESS, DONE] }
   *               priority: { type: string, enum: [LOW, MEDIUM, HIGH] }
   *               dueDate: { type: string, format: date-time }
   *     responses:
   *       200:
   *         description: Tarea actualizada
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Task' }
   *   delete:
   *     summary: Elimina una tarea
   *     tags: [Tasks]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       204:
   *         description: Tarea eliminada
   */
  tasksRouter
    .route('/:id')
    .get(validate(taskIdParamSchema, 'params'), asyncHandler(controller.getTask))
    .put(
      validate(taskIdParamSchema, 'params'),
      validate(updateTaskSchema, 'body'),
      asyncHandler(controller.updateTask),
    )
    .delete(validate(taskIdParamSchema, 'params'), asyncHandler(controller.deleteTask));

  return Router().use('/projects/:projectId/tasks', projectTasksRouter).use('/tasks', tasksRouter);
}
