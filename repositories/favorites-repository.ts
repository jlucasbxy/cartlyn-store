import { prisma } from '@/lib/prisma';

function findUserFavorites(userId: string) {
    return prisma.favorite.findMany({
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

function createFavorite(userId: string, productId: string) {
    return prisma.favorite.create({
        data: {
            userId,
            productId,
        },
    });
}

function deleteFavorite(userId: string, productId: string) {
    return prisma.favorite.deleteMany({
        where: {
            userId,
            productId,
        },
    });
}

export const favoritesRepository = {
    findUserFavorites,
    createFavorite,
    deleteFavorite,
};
