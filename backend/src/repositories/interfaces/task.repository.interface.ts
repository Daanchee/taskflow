import type {
  CreateTaskDTO,
  Task,
  TaskFiltersQuery,
  UpdateTaskDTO,
} from '../../schemas/task.schema.js';

export interface ITaskRepository {
  findByProjectId(projectId: string, filters?: TaskFiltersQuery): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(projectId: string, data: CreateTaskDTO): Promise<Task>;
  update(id: string, data: UpdateTaskDTO): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
  deleteByProjectId(projectId: string): Promise<void>;
}
