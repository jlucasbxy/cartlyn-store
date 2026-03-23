import { Prisma } from "@prisma/client";
import type { OrderDTO } from "@/dtos";
import { CartEmptyError, CartItemsUnavailableError } from "@/errors";
import { toNumber } from "@/lib/price";
import { createCartRepository } from "@/repositories/cart-repository";
import { createOrdersRepository } from "@/repositories/orders-repository";

type SerializableOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: Prisma.Decimal | number;
  productName: string;
  product: { id: string; name: string; imageUrl: string };
};

type SerializableOrder = {
  id: string;
  userId: string;
  total: Prisma.Decimal | number;
  createdAt: Date;
  items: SerializableOrderItem[];
};

function serializeOrder(order: SerializableOrder): OrderDTO {
  return {
    id: order.id,
    userId: order.userId,
    total: toNumber(order.total),
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: toNumber(item.price),
      productName: item.productName,
      product: {
        id: item.product.id,
        name: item.product.name,
        imageUrl: item.product.imageUrl
      }
    }))
  };
}

type Deps = {
  prisma: typeof prisma;
};

export function createOrdersService(deps: Deps) {
  async function getOrders(userId: string): Promise<OrderDTO[]> {
    const orders = await createOrdersRepository({
      prisma: deps.prisma
    }).findUserOrders(userId);
    return orders.map(serializeOrder);
  }

  async function checkout(userId: string): Promise<OrderDTO> {
    const order = await deps.prisma.$transaction(async (tx) => {
      const cartRepository = createCartRepository({ prisma: tx });
      const ordersRepository = createOrdersRepository({ prisma: tx });
      const cartItems = await cartRepository.findUserCartForCheckout(userId);

      if (cartItems.length === 0) {
        throw new CartEmptyError();
      }

      const inactiveProducts = cartItems.filter((item) => !item.product.active);

      if (inactiveProducts.length > 0) {
        throw new CartItemsUnavailableError({
          inactiveProducts: inactiveProducts.map((item) => item.product.name)
        });
      }

      const total = cartItems
        .reduce(
          (sum, item) => sum.plus(item.product.price.mul(item.quantity)),
          new Prisma.Decimal(0)
        )
        .toNumber();

      const createdOrder = await ordersRepository.createOrder(
        userId,
        cartItems,
        total
      );
      await cartRepository.clearUserCart(userId);
      return createdOrder;
    });

    return serializeOrder(order);
  }

  return { getOrders, checkout };
}
