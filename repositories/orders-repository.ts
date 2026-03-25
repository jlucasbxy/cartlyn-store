import type { Prisma } from "@prisma/client";
import type { PrismaInstance } from "@/prisma";
import type { OrdersRepository } from "./orders-repository.interface";

type TransactionCartItem = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

type Deps = {
  prisma: PrismaInstance;
};

export function createOrdersRepository(deps: Deps): OrdersRepository {
  function findUserOrders(userId: string) {
    return deps.prisma.order.findMany({
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

  function createOrder(
    userId: string,
    cartItems: TransactionCartItem[],
    total: number,
    paymentId: string
  ) {
    return deps.prisma.order.create({
      data: {
        userId,
        total,
        paymentId,
        paymentStatus: "PAID",
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
  }

  return { findUserOrders, createOrder };
}
