import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: {
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
    },
  });
}
