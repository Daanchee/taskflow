import type { Request, Response } from 'express';
import type { StatsService } from '../services/stats.service.js';

export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  getDashboardStats = async (_req: Request, res: Response) => {
    const stats = await this.statsService.getDashboardStats();
    res.json(stats);
  };
}
