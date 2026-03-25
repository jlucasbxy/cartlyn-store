import { Prisma, type PrismaClient } from "@prisma/client";
import type { CreditCardPayload, OrderDTO } from "@/dtos";
import {
  CartEmptyError,
  CartItemsUnavailableError,
  PaymentFailedError
} from "@/errors";
import { toNumber } from "@/lib/price";
import { createCartRepository } from "@/repositories/cart-repository";
import { createOrdersRepository } from "@/repositories/orders-repository";
import type { PaymentGatewayService } from "./payment-gateway-service.interface";
import type { OrdersService } from "./orders-service.interface";

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
  paymentId: string | null;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: Date;
  items: SerializableOrderItem[];
};

function serializeOrder(order: SerializableOrder): OrderDTO {
  return {
    id: order.id,
    userId: order.userId,
    total: toNumber(order.total),
    paymentId: order.paymentId,
    paymentStatus: order.paymentStatus,
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
  prisma: PrismaClient;
  paymentGateway: PaymentGatewayService;
};

export function createOrdersService(deps: Deps): OrdersService {
  async function getOrders(userId: string): Promise<OrderDTO[]> {
    const orders = await createOrdersRepository({
      prisma: deps.prisma
    }).findUserOrders(userId);
    return orders.map(serializeOrder);
  }

  async function checkout(
    userId: string,
    card: CreditCardPayload
  ): Promise<OrderDTO> {
    const cartItems = await createCartRepository({
      prisma: deps.prisma
    }).findUserCartForCheckout(userId);

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

    const totalInCents = Math.round(total * 100);

    const paymentResult = await deps.paymentGateway.charge(card, totalInCents);

    if (paymentResult.status === "FAILED") {
      throw new PaymentFailedError();
    }

    const order = await deps.prisma.$transaction(async (tx) => {
      const cartRepository = createCartRepository({ prisma: tx });
      const ordersRepository = createOrdersRepository({ prisma: tx });

      const createdOrder = await ordersRepository.createOrder(
        userId,
        cartItems,
        total,
        paymentResult.paymentId
      );
      await cartRepository.clearUserCart(userId);
      return createdOrder;
    });

    return serializeOrder(order);
  }

  return { getOrders, checkout };
}
