import type { Request, Response } from 'express';
import type { ProjectService } from '../services/project.service.js';
import type {
  CreateProjectDTO,
  ListProjectsQuery,
  UpdateProjectDTO,
} from '../schemas/project.schema.js';

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  listProjects = async (req: Request, res: Response) => {
    const { search } = req.query as unknown as ListProjectsQuery;
    const projects = await this.projectService.listProjects(search);
    res.json(projects);
  };

  getProject = async (req: Request, res: Response) => {
    const project = await this.projectService.getProject(req.params.id as string);
    res.json(project);
  };

  createProject = async (req: Request, res: Response) => {
    const data = req.body as CreateProjectDTO;
    const project = await this.projectService.createProject(data);
    res.status(201).json(project);
  };

  updateProject = async (req: Request, res: Response) => {
    const data = req.body as UpdateProjectDTO;
    const project = await this.projectService.updateProject(req.params.id as string, data);
    res.json(project);
  };

  deleteProject = async (req: Request, res: Response) => {
    await this.projectService.deleteProject(req.params.id as string);
    res.status(204).send();
  };
}
