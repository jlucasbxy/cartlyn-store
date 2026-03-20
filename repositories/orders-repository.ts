import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib";

type TransactionCartItem = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

function findUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

function createOrderFromCart(
  userId: string,
  cartItems: TransactionCartItem[],
  total: number
) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const order = await tx.order.create({
      data: {
        userId,
        total,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            productName: item.product.name
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    await tx.cartItem.deleteMany({
      where: { userId }
    });

    return order;
  });
}

export const ordersRepository = {
  findUserOrders,
  createOrderFromCart
};
