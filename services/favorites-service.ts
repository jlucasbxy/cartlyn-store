import { Prisma } from "@prisma/client";
import type { FavoriteDTO } from "@/dtos";
import { toNumber } from "@/lib";
import { favoritesRepository, productsRepository } from "@/repositories";
import { ServiceError } from "@/services/service-error";

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
    throw new ServiceError("Produto não encontrado", 404);
  }

  try {
    return await favoritesRepository.createFavorite(userId, productId);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ServiceError("Produto já está nos favoritos", 400);
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
