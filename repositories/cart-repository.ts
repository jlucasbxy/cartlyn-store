import { prisma } from '@/lib/prisma';

function findUserCart(userId: string) {
    return prisma.cartItem.findMany({
        where: { userId },
        include: {
            product: {
                include: {
                    seller: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}

function findUserCartWithProducts(userId: string) {
    return prisma.cartItem.findMany({
        where: { userId },
        include: { product: true },
    });
}

function upsertItem(userId: string, productId: string, quantity: number) {
    return prisma.cartItem.upsert({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
        update: {
            quantity: {
                increment: quantity,
            },
        },
        create: {
            userId,
            productId,
            quantity,
        },
        include: { product: true },
    });
}

function updateQuantity(userId: string, productId: string, quantity: number) {
    return prisma.cartItem.update({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
        data: { quantity },
        include: { product: true },
    });
}

function deleteItem(userId: string, productId: string) {
    return prisma.cartItem.delete({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
    });
}

function clearUserCart(userId: string) {
    return prisma.cartItem.deleteMany({
        where: { userId },
    });
}

function clearUserCartAndFavorites(userId: string) {
    return prisma.$transaction([
        prisma.cartItem.deleteMany({
            where: { userId },
        }),
        prisma.favorite.deleteMany({
            where: { userId },
        }),
    ]);
}

export const cartRepository = {
    findUserCart,
    findUserCartWithProducts,
    upsertItem,
    updateQuantity,
    deleteItem,
    clearUserCart,
    clearUserCartAndFavorites,
};
