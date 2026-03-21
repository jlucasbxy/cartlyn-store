import { Prisma } from "@prisma/client";
import { ErrorCode } from "@/dtos";
import type { FavoriteDTO } from "@/dtos";
import { ConflictError, NotFoundError } from "@/errors";
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
    throw new NotFoundError(ErrorCode.PRODUCT_NOT_FOUND, "Produto não encontrado");
  }

  try {
    return await favoritesRepository.createFavorite(userId, productId);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictError(ErrorCode.PRODUCT_ALREADY_FAVORITED, "Produto já está nos favoritos");
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
