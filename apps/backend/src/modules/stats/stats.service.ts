import { prisma } from '../../core/database/prisma.js';

class StatsService {
  async getDashboardStats() {
    const [
      totalProducts,
      productsByStatus,
      lowInventoryCount,
      ownerCount,
      productsByOwner,
      recentProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.product.count({
        where: { inventory: { lt: 10 } },
      }),
      prisma.owner.count(),
      prisma.owner.findMany({
        select: {
          id: true,
          name: true,
          _count: { select: { products: true } },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { owner: true },
      }),
    ]);

    const statusCounts = productsByStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalProducts,
      activeProducts: statusCounts['ACTIVE'] || 0,
      draftProducts: statusCounts['DRAFT'] || 0,
      archivedProducts: statusCounts['ARCHIVED'] || 0,
      lowInventoryCount,
      ownerCount,
      productsByOwner: productsByOwner.map((o) => ({
        id: o.id,
        name: o.name,
        productCount: o._count.products,
      })),
      recentProducts,
    };
  }
}

export const statsService = new StatsService();
