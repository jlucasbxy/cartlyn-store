import type { Prisma } from "@prisma/client";

type CartItemForCheckout = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: { select: { id: true; name: true; imageUrl: true } };
      };
    };
  };
}>;

export interface OrdersRepository {
  findUserOrders(userId: string): Promise<OrderWithItems[]>;
  createOrder(
    userId: string,
    cartItems: CartItemForCheckout[],
    total: number
  ): Promise<OrderWithItems>;
}
