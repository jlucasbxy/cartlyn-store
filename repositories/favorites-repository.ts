import type { PrismaInstance } from "@/prisma";
import { prisma } from "@/prisma";

type Deps = {
  prisma: PrismaInstance;
};

export function createFavoritesRepository(deps: Deps) {
  function findUserFavorites(userId: string) {
    return deps.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            seller: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  function createFavorite(userId: string, productId: string) {
    return deps.prisma.favorite.create({
      data: {
        userId,
        productId
      }
    });
  }

  function deleteFavorite(userId: string, productId: string) {
    return deps.prisma.favorite.deleteMany({
      where: {
        userId,
        productId
      }
    });
  }

  function clearUserFavorites(userId: string) {
    return deps.prisma.favorite.deleteMany({ where: { userId } });
  }

  return {
    findUserFavorites,
    createFavorite,
    deleteFavorite,
    clearUserFavorites
  };
}

export const favoritesRepository = createFavoritesRepository({ prisma });
