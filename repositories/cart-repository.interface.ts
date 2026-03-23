import type { CartItem, Prisma } from "@prisma/client";

type CartItemForDisplay = Prisma.CartItemGetPayload<{
  include: {
    product: {
      include: {
        seller: { select: { id: true; name: true } };
      };
    };
  };
}>;

type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

export interface CartRepository {
  findUserCartForDisplay(userId: string): Promise<CartItemForDisplay[]>;
  findUserCartForCheckout(userId: string): Promise<CartItemWithProduct[]>;
  upsertItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<CartItemWithProduct>;
  updateQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<CartItemWithProduct>;
  deleteItem(userId: string, productId: string): Promise<CartItem>;
  clearUserCart(userId: string): Promise<Prisma.BatchPayload>;
}
