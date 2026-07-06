import { Router } from 'express';
import type { ProjectController } from '../controllers/project.controller.js';
import { validate } from '../middlewares/validate.js';
import { asyncHandler } from '../utils/async-handler.js';
import {
  createProjectSchema,
  listProjectsQuerySchema,
  projectIdParamSchema,
  updateProjectSchema,
} from '../schemas/project.schema.js';

export function createProjectRouter(controller: ProjectController): Router {
  const router = Router();

  /**
   * @openapi
   * /projects:
   *   get:
   *     summary: Lista todos los proyectos
   *     tags: [Projects]
   *     parameters:
   *       - in: query
   *         name: search
   *         schema: { type: string }
   *         description: Filtra proyectos por nombre
   *     responses:
   *       200:
   *         description: Lista de proyectos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items: { $ref: '#/components/schemas/Project' }
   *   post:
   *     summary: Crea un nuevo proyecto
   *     tags: [Projects]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name]
   *             properties:
   *               name: { type: string }
   *               description: { type: string }
   *     responses:
   *       201:
   *         description: Proyecto creado
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Project' }
   */
  router
    .route('/')
    .get(validate(listProjectsQuerySchema, 'query'), asyncHandler(controller.listProjects))
    .post(validate(createProjectSchema, 'body'), asyncHandler(controller.createProject));

  /**
   * @openapi
   * /projects/{id}:
   *   get:
   *     summary: Obtiene un proyecto por id
   *     tags: [Projects]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: Proyecto encontrado
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Project' }
   *       404:
   *         description: Proyecto no encontrado
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Error' }
   *   put:
   *     summary: Actualiza un proyecto
   *     tags: [Projects]
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
   *               name: { type: string }
   *               description: { type: string }
   *     responses:
   *       200:
   *         description: Proyecto actualizado
   *         content:
   *           application/json:
   *             schema: { $ref: '#/components/schemas/Project' }
   *   delete:
   *     summary: Elimina un proyecto y sus tareas (cascada)
   *     tags: [Projects]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       204:
   *         description: Proyecto eliminado
   */
  router
    .route('/:id')
    .get(validate(projectIdParamSchema, 'params'), asyncHandler(controller.getProject))
    .put(
      validate(projectIdParamSchema, 'params'),
      validate(updateProjectSchema, 'body'),
      asyncHandler(controller.updateProject),
    )
    .delete(validate(projectIdParamSchema, 'params'), asyncHandler(controller.deleteProject));

  return router;
}
