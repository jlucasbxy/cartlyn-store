import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { productsRepository } from '@/repositories/products-repository';

async function getDashboardStats(sellerId: string) {
    const totalProducts = await productsRepository.countBySeller(sellerId);

    const productsSoldAggregate = await prisma.orderItem.aggregate({
        where: {
            product: {
                sellerId,
            },
        },
        _sum: {
            quantity: true,
        },
    });

    const totalRevenueRows = await prisma.$queryRaw<Array<{ total: Prisma.Decimal | null }>>`
        SELECT COALESCE(SUM(oi."price" * oi."quantity"), 0) AS total
        FROM "OrderItem" oi
        INNER JOIN "Product" p ON p."id" = oi."productId"
        WHERE p."sellerId" = ${sellerId}
    `;

    const topProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
            product: {
                sellerId,
            },
        },
        _sum: {
            quantity: true,
        },
        orderBy: {
            _sum: {
                quantity: 'desc',
            },
        },
        take: 1,
    });

    return {
        totalProducts,
        totalProductsSold: productsSoldAggregate._sum.quantity ?? 0,
        totalRevenue: totalRevenueRows[0]?.total ?? 0,
        bestSellingProductId: topProducts[0]?.productId,
        bestSellingProductQuantity: topProducts[0]?._sum.quantity ?? 0,
    };
}

export const sellerDashboardRepository = {
    getDashboardStats,
};
