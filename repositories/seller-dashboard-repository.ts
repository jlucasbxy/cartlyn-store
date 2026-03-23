import type { Prisma, PrismaClient } from "@prisma/client";
import { createProductsRepository } from "@/repositories/products-repository";

type Deps = {
  prisma: PrismaClient;
  productsRepository: ReturnType<typeof createProductsRepository>;
};

export function createSellerDashboardRepository(deps: Deps) {
  async function getDashboardStats(sellerId: string) {
    const totalProducts = await deps.productsRepository.countBySeller(sellerId);

    const productsSoldAggregate = await deps.prisma.orderItem.aggregate({
      where: {
        product: {
          sellerId
        }
      },
      _sum: {
        quantity: true
      }
    });

    const totalRevenueRows = await deps.prisma.$queryRaw<
      Array<{ total: Prisma.Decimal | null }>
    >`
        SELECT COALESCE(SUM(oi."price" * oi."quantity"), 0) AS total
        FROM "OrderItem" oi
        INNER JOIN "Product" p ON p."id" = oi."productId"
        WHERE p."sellerId" = ${sellerId}
    `;

    const topProducts = await deps.prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        product: {
          sellerId
        }
      },
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: "desc"
        }
      },
      take: 1
    });

    return {
      totalProducts,
      totalProductsSold: productsSoldAggregate._sum.quantity ?? 0,
      totalRevenue: totalRevenueRows[0]?.total ?? 0,
      bestSellingProductId: topProducts[0]?.productId,
      bestSellingProductQuantity: topProducts[0]?._sum.quantity ?? 0
    };
  }

  return { getDashboardStats };
}
