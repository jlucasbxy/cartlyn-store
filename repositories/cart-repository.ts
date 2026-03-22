import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/prisma";

type Deps = {
  prisma: PrismaClient;
};

export function createCartRepository(deps: Deps) {
  function findUserCart(userId: string) {
    return deps.prisma.cartItem.findMany({
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

  function findUserCartWithProducts(userId: string) {
    return deps.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });
  }

  function upsertItem(userId: string, productId: string, quantity: number) {
    return deps.prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      update: {
        quantity: {
          increment: quantity
        }
      },
      create: {
        userId,
        productId,
        quantity
      },
      include: { product: true }
    });
  }

  function updateQuantity(userId: string, productId: string, quantity: number) {
    return deps.prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      data: { quantity },
      include: { product: true }
    });
  }

  function deleteItem(userId: string, productId: string) {
    return deps.prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });
  }

  function clearUserCart(userId: string) {
    return deps.prisma.cartItem.deleteMany({
      where: { userId }
    });
  }

  function clearUserCartAndFavorites(userId: string) {
    return deps.prisma.$transaction([
      deps.prisma.cartItem.deleteMany({
        where: { userId }
      }),
      deps.prisma.favorite.deleteMany({
        where: { userId }
      })
    ]);
  }

  return {
    findUserCart,
    findUserCartWithProducts,
    upsertItem,
    updateQuantity,
    deleteItem,
    clearUserCart,
    clearUserCartAndFavorites
  };
}

export const cartRepository = createCartRepository({ prisma });
