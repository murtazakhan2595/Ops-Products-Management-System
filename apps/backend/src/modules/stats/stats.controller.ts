import type { Request, Response, NextFunction } from 'express';
import { statsService } from './stats.service.js';
import { sendSuccess } from '../../core/utils/response.js';

class StatsController {
  async getDashboardStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await statsService.getDashboardStats();
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }
}

export const statsController = new StatsController();
