import type { Prisma } from "@prisma/client";
import type { OrderDTO } from "@/dtos";
import { CartEmptyError, CartItemsUnavailableError } from "@/errors";
import { toNumber } from "@/lib";
import { cartRepository, ordersRepository } from "@/repositories";

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
  ordersRepository: typeof ordersRepository;
  cartRepository: typeof cartRepository;
};

export function createOrdersService(deps: Deps) {
  async function getOrders(userId: string): Promise<OrderDTO[]> {
    const orders = await deps.ordersRepository.findUserOrders(userId);
    return orders.map(serializeOrder);
  }

  async function checkout(userId: string): Promise<OrderDTO> {
    const cartItems = await deps.cartRepository.findUserCartWithProducts(userId);

    if (cartItems.length === 0) {
      throw new CartEmptyError();
    }

    const inactiveProducts = cartItems.filter((item) => !item.product.active);

    if (inactiveProducts.length > 0) {
      throw new CartItemsUnavailableError({ inactiveProducts: inactiveProducts.map((item) => item.product.name) });
    }

    const total = cartItems.reduce(
      (sum, item) => sum + toNumber(item.product.price) * item.quantity,
      0
    );

    const order = await deps.ordersRepository.createOrderFromCart(
      userId,
      cartItems,
      total
    );

    return serializeOrder(order);
  }

  return { getOrders, checkout };
}

export const ordersService = createOrdersService({ ordersRepository, cartRepository });
