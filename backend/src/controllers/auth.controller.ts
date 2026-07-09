import type { Request, Response } from 'express';
import { env } from '../config/env.js';
import type { AuthService } from '../services/auth.service.js';
import type { LoginDTO } from '../schemas/auth.schema.js';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body as LoginDTO;
    const session = await this.authService.login(username, password);

    res.cookie(env.SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      path: '/',
    });
    res.json({ username: env.ADMIN_USERNAME });
  };

  logout = async (req: Request, res: Response) => {
    const token = req.cookies?.[env.SESSION_COOKIE_NAME] as string | undefined;
    if (token) {
      await this.authService.logout(token);
    }
    res.clearCookie(env.SESSION_COOKIE_NAME, { path: '/' });
    res.status(204).send();
  };

  me = async (_req: Request, res: Response) => {
    res.json({ username: env.ADMIN_USERNAME });
  };
}
