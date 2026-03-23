import { Prisma } from "@prisma/client";

import {
  CartItemNotFoundError,
  ProductNotFoundOrUnavailableError
} from "@/errors";
import { createCartService } from "@/services/cart-service";

function makeCartRepo(overrides = {}) {
  return {
    findUserCartForDisplay: vi.fn(),
    upsertItem: vi.fn(),
    updateQuantity: vi.fn(),
    deleteItem: vi.fn(),
    ...overrides
  };
}

function makeProductsRepo(overrides = {}) {
  return {
    checkActiveExists: vi.fn(),
    ...overrides
  };
}

function makePrismaP2025() {
  return new Prisma.PrismaClientKnownRequestError("record not found", {
    code: "P2025",
    clientVersion: "5.0.0"
  });
}

describe("cartService.getCart", () => {
  it("returns mapped cart items and computed total", async () => {
    const cartRepo = makeCartRepo({
      findUserCartForDisplay: vi.fn().mockResolvedValue([
        {
          id: "ci-1",
          userId: "u-1",
          productId: "p-1",
          quantity: 2,
          product: {
            id: "p-1",
            name: "Widget",
            price: new Prisma.Decimal("10.00"),
            imageUrl: ""
          }
        },
        {
          id: "ci-2",
          userId: "u-1",
          productId: "p-2",
          quantity: 1,
          product: {
            id: "p-2",
            name: "Gadget",
            price: new Prisma.Decimal("5.50"),
            imageUrl: ""
          }
        }
      ])
    });
    const service = createCartService({
      cartRepository: cartRepo as never,
      productsRepository: makeProductsRepo() as never
    });

    const cart = await service.getCart("u-1");

    expect(cart.total).toBe(25.5); // 2*10 + 1*5.5
    expect(cart.items[0].product.price).toBe(10);
    expect(cart.items[1].product.price).toBe(5.5);
  });
});

describe("cartService.addToCart", () => {
  it("throws ProductNotFoundOrUnavailableError when product does not exist", async () => {
    const productsRepo = makeProductsRepo({
      checkActiveExists: vi.fn().mockResolvedValue(false)
    });
    const service = createCartService({
      cartRepository: makeCartRepo() as never,
      productsRepository: productsRepo as never
    });

    await expect(service.addToCart("u-1", "p-1", 1)).rejects.toThrow(
      ProductNotFoundOrUnavailableError
    );
  });

  it("returns the upserted cart item with price as number", async () => {
    const cartItem = {
      id: "ci-1",
      userId: "u-1",
      productId: "p-1",
      quantity: 3,
      product: {
        id: "p-1",
        name: "Widget",
        price: new Prisma.Decimal("19.99"),
        imageUrl: ""
      }
    };
    const cartRepo = makeCartRepo({
      upsertItem: vi.fn().mockResolvedValue(cartItem)
    });
    const productsRepo = makeProductsRepo({
      checkActiveExists: vi.fn().mockResolvedValue(true)
    });
    const service = createCartService({
      cartRepository: cartRepo as never,
      productsRepository: productsRepo as never
    });

    const result = await service.addToCart("u-1", "p-1", 3);

    expect(result.product.price).toBe(19.99);
    expect(cartRepo.upsertItem).toHaveBeenCalledWith("u-1", "p-1", 3);
  });
});

describe("cartService.updateCartItem", () => {
  it("returns updated cart item with price as number", async () => {
    const cartItem = {
      id: "ci-1",
      userId: "u-1",
      productId: "p-1",
      quantity: 5,
      product: {
        id: "p-1",
        name: "Widget",
        price: new Prisma.Decimal("10.00"),
        imageUrl: ""
      }
    };
    const cartRepo = makeCartRepo({
      updateQuantity: vi.fn().mockResolvedValue(cartItem)
    });
    const service = createCartService({
      cartRepository: cartRepo as never,
      productsRepository: makeProductsRepo() as never
    });

    const result = await service.updateCartItem("u-1", "p-1", 5);
    expect(result.product.price).toBe(10);
  });

  it("throws CartItemNotFoundError on Prisma P2025", async () => {
    const cartRepo = makeCartRepo({
      updateQuantity: vi.fn().mockRejectedValue(makePrismaP2025())
    });
    const service = createCartService({
      cartRepository: cartRepo as never,
      productsRepository: makeProductsRepo() as never
    });

    await expect(service.updateCartItem("u-1", "p-1", 5)).rejects.toThrow(
      CartItemNotFoundError
    );
  });

  it("rethrows unknown errors", async () => {
    const cartRepo = makeCartRepo({
      updateQuantity: vi.fn().mockRejectedValue(new Error("unexpected"))
    });
    const service = createCartService({
      cartRepository: cartRepo as never,
      productsRepository: makeProductsRepo() as never
    });

    await expect(service.updateCartItem("u-1", "p-1", 5)).rejects.toThrow(
      "unexpected"
    );
  });
});

describe("cartService.removeFromCart", () => {
  it("removes the item successfully", async () => {
    const cartRepo = makeCartRepo({
      deleteItem: vi.fn().mockResolvedValue(undefined)
    });
    const service = createCartService({
      cartRepository: cartRepo as never,
      productsRepository: makeProductsRepo() as never
    });

    await expect(service.removeFromCart("u-1", "p-1")).resolves.toBeUndefined();
    expect(cartRepo.deleteItem).toHaveBeenCalledWith("u-1", "p-1");
  });

  it("throws CartItemNotFoundError on Prisma P2025", async () => {
    const cartRepo = makeCartRepo({
      deleteItem: vi.fn().mockRejectedValue(makePrismaP2025())
    });
    const service = createCartService({
      cartRepository: cartRepo as never,
      productsRepository: makeProductsRepo() as never
    });

    await expect(service.removeFromCart("u-1", "p-1")).rejects.toThrow(
      CartItemNotFoundError
    );
  });
});
