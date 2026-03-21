import { Prisma } from "@prisma/client";
import type { FavoriteDTO } from "@/dtos";
import { ProductAlreadyFavoritedError, ProductNotFoundError } from "@/errors";
import { toNumber } from "@/lib";
import { favoritesRepository, productsRepository } from "@/repositories";

async function getFavorites(userId: string): Promise<FavoriteDTO[]> {
  const favorites = await favoritesRepository.findUserFavorites(userId);

  return favorites.map((favorite) => ({
    ...favorite,
    product: {
      ...favorite.product,
      price: toNumber(favorite.product.price)
    }
  }));
}

async function addFavorite(userId: string, productId: string) {
  const product = await productsRepository.findById(productId);

  if (!product) {
    throw new ProductNotFoundError();
  }

  try {
    return await favoritesRepository.createFavorite(userId, productId);
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
  return favoritesRepository.deleteFavorite(userId, productId);
}

export const favoritesService = {
  getFavorites,
  addFavorite,
  removeFavorite
};
