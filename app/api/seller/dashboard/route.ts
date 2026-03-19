import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { toNumber } from '@/lib/price';
import { Prisma } from '@prisma/client';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'SELLER') {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const sellerId = session.user.id;

        // Get total products registered
        const totalProducts = await prisma.product.count({
            where: { sellerId },
        });

        // Get total products sold
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

        const totalProductsSold = productsSoldAggregate._sum.quantity ?? 0;

        const totalRevenueRows = await prisma.$queryRaw<Array<{ total: Prisma.Decimal | null }>>`
            SELECT COALESCE(SUM(oi."price" * oi."quantity"), 0) AS total
            FROM "OrderItem" oi
            INNER JOIN "Product" p ON p."id" = oi."productId"
            WHERE p."sellerId" = ${sellerId}
        `;
        const totalRevenue = toNumber(totalRevenueRows[0]?.total ?? 0);

        // Get best selling product
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

        const bestSellingProductId = topProducts[0]?.productId;

        let bestSellingProduct = null;
        if (bestSellingProductId) {
            bestSellingProduct = await prisma.product.findUnique({
                where: { id: bestSellingProductId },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    imageUrl: true,
                },
            });
        }

        return NextResponse.json({
            totalProducts,
            totalProductsSold,
            totalRevenue,
            bestSellingProduct: bestSellingProduct
                ? {
                    ...bestSellingProduct,
                    price: toNumber(bestSellingProduct.price),
                    quantitySold: topProducts[0]?._sum.quantity ?? 0,
                }
                : null,
        });
    } catch (error) {
        console.error('Dashboard fetch error:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar dados do dashboard' },
            { status: 500 }
        );
    }
}
