import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description:
        'API REST de TaskFlow: gestor de proyectos y tareas tipo Kanban. Persistencia en memoria (sin base de datos) tras una capa de repositorio intercambiable.',
    },
    servers: [{ url: '/api', description: 'API base path' }],
    components: {
      schemas: {
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            projectId: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] },
            priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
            dueDate: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            completedAt: { type: 'string', format: 'date-time' },
          },
        },
        DashboardStats: {
          type: 'object',
          properties: {
            byStatus: {
              type: 'object',
              properties: {
                TODO: { type: 'integer' },
                IN_PROGRESS: { type: 'integer' },
                DONE: { type: 'integer' },
              },
            },
            byPriority: {
              type: 'object',
              properties: {
                LOW: { type: 'integer' },
                MEDIUM: { type: 'integer' },
                HIGH: { type: 'integer' },
              },
            },
            byProject: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  projectId: { type: 'string', format: 'uuid' },
                  projectName: { type: 'string' },
                  taskCount: { type: 'integer' },
                },
              },
            },
            completedTrend: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: { type: 'string', format: 'date' },
                  count: { type: 'integer' },
                },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                code: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
});
