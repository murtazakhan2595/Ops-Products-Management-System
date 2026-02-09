import type { Request, Response, NextFunction } from 'express';
import { productService } from './product.service.js';
import { sendSuccess, sendPaginatedSuccess } from '../../core/utils/response.js';

class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search, sku, ownerId, status, sortBy, sortOrder } = req.query;

      const { products, meta } = await productService.getProducts({
        page: Number(page),
        limit: Number(limit),
        search: search as string | undefined,
        sku: sku as string | undefined,
        ownerId: ownerId as string | undefined,
        status: status as string | undefined,
        sortBy: sortBy as string | undefined,
        sortOrder: sortOrder as 'asc' | 'desc' | undefined,
      });

      sendPaginatedSuccess(res, products, meta);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id!);
      sendSuccess(res, product);
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);
      sendSuccess(res, product, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.updateProduct(req.params.id!, req.body);
      sendSuccess(res, product);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.deleteProduct(req.params.id!);
      sendSuccess(res, null, 204);
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
