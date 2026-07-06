export interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProjectDTO {
  name: string
  description?: string
}

export type UpdateProjectDTO = Partial<CreateProjectDTO>
