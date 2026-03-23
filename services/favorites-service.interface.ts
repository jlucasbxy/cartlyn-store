import type { Favorite, Prisma } from "@prisma/client";
import type { FavoriteDTO } from "@/dtos";

export interface FavoritesService {
  getFavorites(userId: string): Promise<FavoriteDTO[]>;
  addFavorite(userId: string, productId: string): Promise<Favorite>;
  removeFavorite(
    userId: string,
    productId: string
  ): Promise<Prisma.BatchPayload>;
}
