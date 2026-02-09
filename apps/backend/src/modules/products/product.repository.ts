import type { Prisma } from '@prisma/client';
import { prisma } from '../../core/database/prisma.js';
import { getSkipTake } from '../../core/utils/pagination.js';

export interface FindManyParams {
  page: number;
  limit: number;
  search?: string;
  sku?: string;
  ownerId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ProductRepository {
  async findMany(params: FindManyParams) {
    const { page, limit, search, sku, ownerId, status, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const { skip, take } = getSkipTake(page, limit);

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (sku) {
      where.sku = { contains: sku, mode: 'insensitive' };
    }
    if (ownerId) {
      where.ownerId = ownerId;
    }
    if (status) {
      where.status = status as Prisma.EnumProductStatusFilter;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { owner: true },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: { owner: true },
    });
  }

  async findBySku(sku: string) {
    return prisma.product.findUnique({
      where: { sku },
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
      include: { owner: true },
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: { owner: true },
    });
  }

  async delete(id: string) {
    return prisma.product.delete({ where: { id } });
  }
}

export const productRepository = new ProductRepository();
