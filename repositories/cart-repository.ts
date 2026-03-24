import type { PrismaInstance } from "@/prisma";
import type { CartRepository } from "./cart-repository.interface";

type Deps = {
  prisma: PrismaInstance;
};

export function createCartRepository(deps: Deps): CartRepository {
  function findUserCartForDisplay(userId: string) {
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

  function findUserCartForCheckout(userId: string) {
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

  return {
    findUserCartForDisplay,
    findUserCartForCheckout,
    upsertItem,
    updateQuantity,
    deleteItem,
    clearUserCart
  };
}
