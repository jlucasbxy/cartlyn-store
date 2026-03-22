import { Prisma } from "@prisma/client";
import type { FavoriteDTO } from "@/dtos";
import { ProductAlreadyFavoritedError, ProductNotFoundError } from "@/errors";
import { toNumber } from "@/lib/client";
import { favoritesRepository, productsRepository } from "@/repositories";

type Deps = {
  favoritesRepository: typeof favoritesRepository;
  productsRepository: typeof productsRepository;
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
    const product = await deps.productsRepository.findById(productId);

    if (!product) {
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

export const favoritesService = createFavoritesService({
  favoritesRepository,
  productsRepository
});
