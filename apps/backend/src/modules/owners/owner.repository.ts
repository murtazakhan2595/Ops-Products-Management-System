import { prisma } from '../../core/database/prisma.js';

class OwnerRepository {
  async findAll() {
    return prisma.owner.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return prisma.owner.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async getProductsByOwner(ownerId: string, skip: number, take: number) {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { ownerId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where: { ownerId } }),
    ]);
    return { products, total };
  }
}

export const ownerRepository = new OwnerRepository();
