import { Prisma } from "@prisma/client";
import type { FavoriteDTO } from "@/dtos";
import { ProductAlreadyFavoritedError, ProductNotFoundError } from "@/errors";
import { toNumber } from "@/lib/price";
import { createFavoritesRepository } from "@/repositories/favorites-repository";
import { createProductsRepository } from "@/repositories/products-repository";

type Deps = {
  favoritesRepository: ReturnType<typeof createFavoritesRepository>;
  productsRepository: ReturnType<typeof createProductsRepository>;
};

export function createFavoritesService(deps: Deps) {
  async function getFavorites(userId: string): Promise<FavoriteDTO[]> {
    const favorites = await deps.favoritesRepository.findUserFavorites(userId);

    return favorites.map((favorite) => ({
      ...favorite,
      product: {
        ...favorite.product,
        price: toNumber(favorite.product.price)
      }
    }));
  }

  async function addFavorite(userId: string, productId: string) {
    const exists = await deps.productsRepository.checkActiveExists(productId);

    if (!exists) {
      throw new ProductNotFoundError();
    }

    try {
      return await deps.favoritesRepository.createFavorite(userId, productId);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ProductAlreadyFavoritedError();
      }

      throw error;
    }
  }

  function removeFavorite(userId: string, productId: string) {
    return deps.favoritesRepository.deleteFavorite(userId, productId);
  }

  return { getFavorites, addFavorite, removeFavorite };
}
