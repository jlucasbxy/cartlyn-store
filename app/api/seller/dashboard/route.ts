import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

        // Get total products sold and total revenue
        const orderItems = await prisma.orderItem.findMany({
            where: {
                product: {
                    sellerId,
                },
            },
            select: {
                quantity: true,
                price: true,
                productId: true,
            },
        });

        const totalProductsSold = orderItems.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        const totalRevenue = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // Get best selling product
        const productSales = orderItems.reduce((acc, item) => {
            if (!acc[item.productId]) {
                acc[item.productId] = 0;
            }
            acc[item.productId] += item.quantity;
            return acc;
        }, {} as Record<string, number>);

        const bestSellingProductId = Object.entries(productSales).sort(
            ([, a], [, b]) => b - a
        )[0]?.[0];

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
                    quantitySold: productSales[bestSellingProductId],
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
