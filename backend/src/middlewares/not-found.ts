import type { Request, Response } from 'express';

export function notFoundMiddleware(req: Request, res: Response) {
  res.status(404).json({
    error: {
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
      code: 'ROUTE_NOT_FOUND',
    },
  });
}
