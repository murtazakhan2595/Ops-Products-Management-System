import type { Request, Response, NextFunction } from 'express';
import { ownerService } from './owner.service.js';
import { sendSuccess, sendPaginatedSuccess } from '../../core/utils/response.js';

class OwnerController {
  async getAllOwners(_req: Request, res: Response, next: NextFunction) {
    try {
      const owners = await ownerService.getAllOwners();
      sendSuccess(res, owners);
    } catch (error) {
      next(error);
    }
  }

  async getOwnerById(req: Request, res: Response, next: NextFunction) {
    try {
      const owner = await ownerService.getOwnerById(req.params.id!);
      sendSuccess(res, owner);
    } catch (error) {
      next(error);
    }
  }

  async getProductsByOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { products, meta } = await ownerService.getProductsByOwner(
        req.params.id!,
        Number(page),
        Number(limit)
      );
      sendPaginatedSuccess(res, products, meta);
    } catch (error) {
      next(error);
    }
  }
}

export const ownerController = new OwnerController();
