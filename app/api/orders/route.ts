import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { toNumber } from '@/lib/price';

function serializeOrder(order: {
    total: unknown;
    items: Array<{
        price: unknown;
        product: {
            price?: unknown;
        };
    }>;
}) {
    return {
        ...order,
        total: toNumber(order.total),
        items: order.items.map((item) => ({
            ...item,
            price: toNumber(item.price),
            product: item.product.price !== undefined
                ? {
                    ...item.product,
                    price: toNumber(item.product.price),
                }
                : item.product,
        })),
    };
}

// Get user order history
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const orders = await prisma.order.findMany({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(orders.map(serializeOrder));
    } catch (error) {
        console.error('Orders fetch error:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar histórico de pedidos' },
            { status: 500 }
        );
    }
}

// Create order (checkout)
export async function POST() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        // Get user cart
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: session.user.id },
            include: { product: true },
        });

        if (cartItems.length === 0) {
            return NextResponse.json(
                { error: 'Carrinho vazio' },
                { status: 400 }
            );
        }

        // Check if all products are still active
        const inactiveProducts = cartItems.filter((item) => !item.product.active);
        if (inactiveProducts.length > 0) {
            return NextResponse.json(
                {
                    error: 'Alguns produtos no carrinho não estão mais disponíveis',
                    inactiveProducts: inactiveProducts.map((item) => item.product.name),
                },
                { status: 400 }
            );
        }

        // Calculate total
        const total = cartItems.reduce(
            (sum, item) => sum + toNumber(item.product.price) * item.quantity,
            0
        );

        // Create order with items in a transaction
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId: session.user.id,
                    total,
                    items: {
                        create: cartItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: toNumber(item.product.price),
                            productName: item.product.name,
                        })),
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            // Clear cart after order is created
            await tx.cartItem.deleteMany({
                where: { userId: session.user.id },
            });

            return newOrder;
        });

        return NextResponse.json(
            {
                message: 'Pedido realizado com sucesso',
                order: serializeOrder(order),
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Erro ao finalizar pedido' },
            { status: 500 }
        );
    }
}
