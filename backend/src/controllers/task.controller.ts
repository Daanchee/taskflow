import type { Request, Response } from 'express';
import type { TaskService } from '../services/task.service.js';
import type { CreateTaskDTO, TaskFiltersQuery, UpdateTaskDTO } from '../schemas/task.schema.js';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  listTasks = async (req: Request, res: Response) => {
    const filters = req.query as unknown as TaskFiltersQuery;
    const tasks = await this.taskService.listTasks(req.params.projectId as string, filters);
    res.json(tasks);
  };

  getTask = async (req: Request, res: Response) => {
    const task = await this.taskService.getTask(req.params.id as string);
    res.json(task);
  };

  createTask = async (req: Request, res: Response) => {
    const data = req.body as CreateTaskDTO;
    const task = await this.taskService.createTask(req.params.projectId as string, data);
    res.status(201).json(task);
  };

  updateTask = async (req: Request, res: Response) => {
    const data = req.body as UpdateTaskDTO;
    const task = await this.taskService.updateTask(req.params.id as string, data);
    res.json(task);
  };

  deleteTask = async (req: Request, res: Response) => {
    await this.taskService.deleteTask(req.params.id as string);
    res.status(204).send();
  };
}
