import { Prisma } from "@prisma/client";

import {
  CartEmptyError,
  CartItemsUnavailableError,
  PaymentFailedError
} from "@/errors";
import { createOrdersService } from "@/services/orders-service";

vi.mock("@/repositories/cart-repository", () => ({
  createCartRepository: vi.fn()
}));

vi.mock("@/repositories/orders-repository", () => ({
  createOrdersRepository: vi.fn()
}));

import { createCartRepository } from "@/repositories/cart-repository";
import { createOrdersRepository } from "@/repositories/orders-repository";

const mockCreateCartRepo = vi.mocked(createCartRepository);
const mockCreateOrdersRepo = vi.mocked(createOrdersRepository);

const baseCard = {
  cardNumber: "1234567890123456",
  cardHolderName: "Test User",
  expiryMonth: 12,
  expiryYear: 2030,
  cvv: "123"
};

function makeActiveCartItem(name: string, price: string, quantity: number) {
  return {
    id: `ci-${name}`,
    userId: "u-1",
    productId: `p-${name}`,
    quantity,
    product: {
      id: `p-${name}`,
      name,
      price: new Prisma.Decimal(price),
      imageUrl: "",
      active: true
    }
  };
}

function makeInactiveCartItem(name: string, price: string, quantity: number) {
  return {
    ...makeActiveCartItem(name, price, quantity),
    product: {
      ...makeActiveCartItem(name, price, quantity).product,
      active: false
    }
  };
}

function makeCreatedOrder(
  total: number,
  paymentId = "pay-1",
  paymentStatus = "PAID" as const
) {
  return {
    id: "order-1",
    userId: "u-1",
    total,
    paymentId,
    paymentStatus,
    createdAt: new Date("2026-01-01"),
    items: []
  };
}

describe("ordersService.checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws CartEmptyError when cart is empty", async () => {
    const cartRepo = { findUserCartForCheckout: vi.fn().mockResolvedValue([]) };
    mockCreateCartRepo.mockReturnValue(cartRepo as never);

    const mockPrisma = { $transaction: vi.fn() };
    const mockPaymentGateway = { charge: vi.fn() };
    const service = createOrdersService({
      prisma: mockPrisma as never,
      paymentGateway: mockPaymentGateway
    });

    await expect(service.checkout("u-1", baseCard)).rejects.toThrow(
      CartEmptyError
    );
    expect(mockPaymentGateway.charge).not.toHaveBeenCalled();
  });

  it("throws CartItemsUnavailableError when cart has inactive products", async () => {
    const items = [makeInactiveCartItem("Widget", "10.00", 1)];
    const cartRepo = {
      findUserCartForCheckout: vi.fn().mockResolvedValue(items)
    };
    mockCreateCartRepo.mockReturnValue(cartRepo as never);

    const mockPrisma = { $transaction: vi.fn() };
    const mockPaymentGateway = { charge: vi.fn() };
    const service = createOrdersService({
      prisma: mockPrisma as never,
      paymentGateway: mockPaymentGateway
    });

    await expect(service.checkout("u-1", baseCard)).rejects.toThrow(
      CartItemsUnavailableError
    );
    expect(mockPaymentGateway.charge).not.toHaveBeenCalled();
  });

  it("throws PaymentFailedError when payment gateway declines", async () => {
    const items = [makeActiveCartItem("Widget", "10.00", 1)];
    const cartRepo = {
      findUserCartForCheckout: vi.fn().mockResolvedValue(items)
    };
    mockCreateCartRepo.mockReturnValue(cartRepo as never);

    const mockPrisma = { $transaction: vi.fn() };
    const mockPaymentGateway = {
      charge: vi
        .fn()
        .mockResolvedValue({ paymentId: "pay-x", status: "FAILED" })
    };
    const service = createOrdersService({
      prisma: mockPrisma as never,
      paymentGateway: mockPaymentGateway
    });

    await expect(service.checkout("u-1", baseCard)).rejects.toThrow(
      PaymentFailedError
    );
    expect(mockPrisma.$transaction).not.toHaveBeenCalled();
  });

  it("creates order, clears cart, and returns serialized order", async () => {
    const items = [
      makeActiveCartItem("Widget", "10.00", 2),
      makeActiveCartItem("Gadget", "5.50", 1)
    ];
    const total = 25.5;
    const createdOrder = {
      ...makeCreatedOrder(total),
      items: items.map((item) => ({
        id: `oi-${item.productId}`,
        orderId: "order-1",
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        productName: item.product.name,
        product: {
          id: item.product.id,
          name: item.product.name,
          imageUrl: item.product.imageUrl
        }
      }))
    };

    const txCartRepo = {
      findUserCartForCheckout: vi.fn().mockResolvedValue(items),
      clearUserCart: vi.fn().mockResolvedValue(undefined)
    };
    const txOrdersRepo = {
      createOrder: vi.fn().mockResolvedValue(createdOrder)
    };

    mockCreateCartRepo.mockReturnValue(txCartRepo as never);
    mockCreateOrdersRepo.mockReturnValue(txOrdersRepo as never);

    const mockPrisma = {
      $transaction: vi.fn((fn: (tx: unknown) => unknown) => fn({}))
    };
    const mockPaymentGateway = {
      charge: vi.fn().mockResolvedValue({ paymentId: "pay-1", status: "PAID" })
    };
    const service = createOrdersService({
      prisma: mockPrisma as never,
      paymentGateway: mockPaymentGateway
    });

    const order = await service.checkout("u-1", baseCard);

    expect(mockPaymentGateway.charge).toHaveBeenCalledWith(
      baseCard,
      Math.round(total * 100)
    );
    expect(txOrdersRepo.createOrder).toHaveBeenCalledWith(
      "u-1",
      items,
      total,
      "pay-1"
    );
    expect(txCartRepo.clearUserCart).toHaveBeenCalledWith("u-1");
    expect(order.total).toBe(total);
    expect(order.paymentId).toBe("pay-1");
    expect(order.paymentStatus).toBe("PAID");
    expect(order.items[0].price).toBe(10);
    expect(order.items[1].price).toBe(5.5);
  });
});

describe("ordersService.getOrders", () => {
  it("returns serialized orders for a user", async () => {
    const rawOrders = [
      {
        id: "order-1",
        userId: "u-1",
        total: new Prisma.Decimal("50.00"),
        paymentId: "pay-1",
        paymentStatus: "PAID" as const,
        createdAt: new Date("2026-01-01"),
        items: [
          {
            id: "oi-1",
            orderId: "order-1",
            productId: "p-1",
            quantity: 2,
            price: new Prisma.Decimal("25.00"),
            productName: "Widget",
            product: { id: "p-1", name: "Widget", imageUrl: "" }
          }
        ]
      }
    ];

    const ordersRepo = { findUserOrders: vi.fn().mockResolvedValue(rawOrders) };
    mockCreateOrdersRepo.mockReturnValue(ordersRepo as never);

    const mockPrisma = { $transaction: vi.fn() };
    const mockPaymentGateway = { charge: vi.fn() };
    const service = createOrdersService({
      prisma: mockPrisma as never,
      paymentGateway: mockPaymentGateway
    });

    const orders = await service.getOrders("u-1");

    expect(orders[0].total).toBe(50);
    expect(orders[0].paymentId).toBe("pay-1");
    expect(orders[0].paymentStatus).toBe("PAID");
    expect(orders[0].items[0].price).toBe(25);
  });
});
