import { toNumber } from '@/lib/price';
import { cartRepository } from '@/repositories/cart-repository';
import { ordersRepository } from '@/repositories/orders-repository';
import { ServiceError } from '@/services/service-error';
import type { Prisma } from '@prisma/client';

type NumericLike = Prisma.Decimal | number | string | null | undefined;

function serializeOrder(order: {
    total: NumericLike;
    items: Array<{
        price: NumericLike;
        product: { price?: NumericLike } & Record<string, unknown>;
    }>;
} & Record<string, unknown>) {
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

async function getOrders(userId: string) {
    const orders = await ordersRepository.findUserOrders(userId);
    return orders.map(serializeOrder);
}

async function checkout(userId: string) {
    const cartItems = await cartRepository.findUserCartWithProducts(userId);

    if (cartItems.length === 0) {
        throw new ServiceError('Carrinho vazio', 400);
    }

    const inactiveProducts = cartItems.filter((item) => !item.product.active);

    if (inactiveProducts.length > 0) {
        throw new ServiceError(
            'Alguns produtos no carrinho não estão mais disponíveis',
            400,
            {
                inactiveProducts: inactiveProducts.map((item) => item.product.name),
            }
        );
    }

    const total = cartItems.reduce(
        (sum, item) => sum + toNumber(item.product.price) * item.quantity,
        0
    );

    const order = await ordersRepository.createOrderFromCart(userId, cartItems, total);

    return serializeOrder(order);
}

export const ordersService = {
    getOrders,
    checkout,
};
