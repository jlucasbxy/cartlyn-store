import type { Prisma } from "@prisma/client";
import type { OrderDTO } from "@/dtos";
import { toNumber } from "@/lib/price";
import { cartRepository } from "@/repositories/cart-repository";
import { ordersRepository } from "@/repositories/orders-repository";
import { ServiceError } from "@/services/service-error";

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

async function getOrders(userId: string): Promise<OrderDTO[]> {
  const orders = await ordersRepository.findUserOrders(userId);
  return orders.map(serializeOrder);
}

async function checkout(userId: string): Promise<OrderDTO> {
  const cartItems = await cartRepository.findUserCartWithProducts(userId);

  if (cartItems.length === 0) {
    throw new ServiceError("Carrinho vazio", 400);
  }

  const inactiveProducts = cartItems.filter((item) => !item.product.active);

  if (inactiveProducts.length > 0) {
    throw new ServiceError(
      "Alguns produtos no carrinho não estão mais disponíveis",
      400,
      {
        inactiveProducts: inactiveProducts.map((item) => item.product.name)
      }
    );
  }

  const total = cartItems.reduce(
    (sum, item) => sum + toNumber(item.product.price) * item.quantity,
    0
  );

  const order = await ordersRepository.createOrderFromCart(
    userId,
    cartItems,
    total
  );

  return serializeOrder(order);
}

export const ordersService = {
  getOrders,
  checkout
};
