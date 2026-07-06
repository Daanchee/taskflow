import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodSchema } from 'zod';
import { ValidationError } from '../errors/app-error.js';

type ValidationSource = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, source: ValidationSource = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError('Datos de entrada inválidos', error.flatten()));
        return;
      }
      next(error);
    }
  };
}
