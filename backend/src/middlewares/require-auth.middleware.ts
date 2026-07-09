import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../errors/app-error.js';
import type { AuthService } from '../services/auth.service.js';

export function createRequireAuthMiddleware(authService: AuthService): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.[env.SESSION_COOKIE_NAME] as string | undefined;

    authService
      .validateSession(token)
      .then((isValid) => {
        if (!isValid) {
          next(new UnauthorizedError('No autenticado'));
          return;
        }
        next();
      })
      .catch(next);
  };
}
