import type { Favorite, Prisma } from "@prisma/client";

type FavoriteWithProduct = Prisma.FavoriteGetPayload<{
  include: {
    product: {
      include: {
        seller: { select: { id: true; name: true } };
      };
    };
  };
}>;

export interface FavoritesRepository {
  findUserFavorites(userId: string): Promise<FavoriteWithProduct[]>;
  createFavorite(userId: string, productId: string): Promise<Favorite>;
  deleteFavorite(
    userId: string,
    productId: string
  ): Promise<Prisma.BatchPayload>;
  clearUserFavorites(userId: string): Promise<Prisma.BatchPayload>;
}
