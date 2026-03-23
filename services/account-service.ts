import type { PrismaClient } from "@prisma/client";
import { InvalidUserTypeError } from "@/errors";
import { createCartRepository } from "@/repositories/cart-repository";
import { createFavoritesRepository } from "@/repositories/favorites-repository";
import { createProductsRepository } from "@/repositories/products-repository";
import { createUsersRepository } from "@/repositories/users-repository";

type Deps = {
  prisma: PrismaClient;
};

export function createAccountService(deps: Deps) {
  async function deactivateOrDeleteAccount(userId: string, role: string) {
    if (role === "CLIENT") {
      await deps.prisma.$transaction(async (tx) => {
        await createUsersRepository({ prisma: tx }).deactivateUser(userId);
        await createCartRepository({ prisma: tx }).clearUserCart(userId);
        await createFavoritesRepository({ prisma: tx }).clearUserFavorites(
          userId
        );
      });
      return {
        message:
          "Conta excluída com sucesso. Seu histórico de compras foi preservado."
      };
    }

    if (role === "SELLER") {
      await deps.prisma.$transaction(async (tx) => {
        await createUsersRepository({ prisma: tx }).deactivateUser(userId);
        await createProductsRepository({ prisma: tx }).deactivateAllBySeller(
          userId
        );
      });
      return {
        message:
          "Conta desativada com sucesso. Todos os seus produtos foram ocultados da loja."
      };
    }

    throw new InvalidUserTypeError();
  }

  return { deactivateOrDeleteAccount };
}
