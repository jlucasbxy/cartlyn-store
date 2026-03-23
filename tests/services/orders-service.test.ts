import { Prisma } from "@prisma/client";

import { CartEmptyError, CartItemsUnavailableError } from "@/errors";
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

function makeCreatedOrder(total: number) {
  return {
    id: "order-1",
    userId: "u-1",
    total,
    createdAt: new Date("2026-01-01"),
    items: []
  };
}

describe("ordersService.checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws CartEmptyError when cart is empty", async () => {
    const txCartRepo = {
      findUserCartForCheckout: vi.fn().mockResolvedValue([])
    };
    mockCreateCartRepo.mockReturnValue(txCartRepo as never);

    const mockPrisma = {
      $transaction: vi.fn((fn: (tx: unknown) => unknown) => fn({}))
    };
    const service = createOrdersService({ prisma: mockPrisma as never });

    await expect(service.checkout("u-1")).rejects.toThrow(CartEmptyError);
  });

  it("throws CartItemsUnavailableError when cart has inactive products", async () => {
    const items = [makeInactiveCartItem("Widget", "10.00", 1)];
    const txCartRepo = {
      findUserCartForCheckout: vi.fn().mockResolvedValue(items)
    };
    mockCreateCartRepo.mockReturnValue(txCartRepo as never);

    const mockPrisma = {
      $transaction: vi.fn((fn: (tx: unknown) => unknown) => fn({}))
    };
    const service = createOrdersService({ prisma: mockPrisma as never });

    await expect(service.checkout("u-1")).rejects.toThrow(
      CartItemsUnavailableError
    );
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
    const service = createOrdersService({ prisma: mockPrisma as never });

    const order = await service.checkout("u-1");

    expect(txOrdersRepo.createOrder).toHaveBeenCalledWith("u-1", items, total);
    expect(txCartRepo.clearUserCart).toHaveBeenCalledWith("u-1");
    expect(order.total).toBe(total);
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
    const service = createOrdersService({ prisma: mockPrisma as never });

    const orders = await service.getOrders("u-1");

    expect(orders[0].total).toBe(50);
    expect(orders[0].items[0].price).toBe(25);
  });
});
