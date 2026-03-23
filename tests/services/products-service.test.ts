import { Prisma } from "@prisma/client";

import { ProductNotFoundError, UnauthorizedError } from "@/errors";
import { createProductsService } from "@/services/products-service";

function makeProductsRepo(overrides = {}) {
  return {
    findProducts: vi.fn(),
    findVisibleById: vi.fn(),
    findActiveById: vi.fn(),
    checkActiveExists: vi.fn(),
    createProduct: vi.fn(),
    updateById: vi.fn(),
    deactivateById: vi.fn(),
    createManyProducts: vi.fn(),
    ...overrides
  };
}

const fakeProductRaw = {
  id: "p-1",
  name: "Widget",
  price: new Prisma.Decimal("19.99"),
  description: "A great widget",
  imageUrl: "https://example.com/img.jpg",
  active: true,
  sellerId: "seller-1"
};

describe("productsService.getProductById", () => {
  it("throws ProductNotFoundError when product does not exist", async () => {
    const repo = makeProductsRepo({
      findVisibleById: vi.fn().mockResolvedValue(null)
    });
    const service = createProductsService({
      productsRepository: repo as never
    });

    await expect(service.getProductById("p-1")).rejects.toThrow(
      ProductNotFoundError
    );
  });

  it("returns product with price as number", async () => {
    const repo = makeProductsRepo({
      findVisibleById: vi.fn().mockResolvedValue(fakeProductRaw)
    });
    const service = createProductsService({
      productsRepository: repo as never
    });

    const product = await service.getProductById("p-1");
    expect(product.price).toBe(19.99);
  });
});

describe("productsService.updateProduct", () => {
  it("throws ProductNotFoundError when product does not exist", async () => {
    const repo = makeProductsRepo({
      findActiveById: vi.fn().mockResolvedValue(null)
    });
    const service = createProductsService({
      productsRepository: repo as never
    });

    await expect(
      service.updateProduct("seller-1", "p-1", { name: "Updated" })
    ).rejects.toThrow(ProductNotFoundError);
  });

  it("throws UnauthorizedError when seller does not own the product", async () => {
    const repo = makeProductsRepo({
      findActiveById: vi
        .fn()
        .mockResolvedValue({ ...fakeProductRaw, sellerId: "other-seller" })
    });
    const service = createProductsService({
      productsRepository: repo as never
    });

    await expect(
      service.updateProduct("seller-1", "p-1", { name: "Updated" })
    ).rejects.toThrow(UnauthorizedError);
  });

  it("returns updated product with price as number", async () => {
    const updatedRaw = {
      ...fakeProductRaw,
      name: "Updated",
      price: new Prisma.Decimal("25.00")
    };
    const repo = makeProductsRepo({
      findActiveById: vi.fn().mockResolvedValue(fakeProductRaw),
      updateById: vi.fn().mockResolvedValue(updatedRaw)
    });
    const service = createProductsService({
      productsRepository: repo as never
    });

    const result = await service.updateProduct("seller-1", "p-1", {
      name: "Updated"
    });
    expect(result.price).toBe(25);
    expect(result.name).toBe("Updated");
  });
});

describe("productsService.deleteProduct", () => {
  it("throws ProductNotFoundError when product does not exist", async () => {
    const repo = makeProductsRepo({
      findActiveById: vi.fn().mockResolvedValue(null)
    });
    const service = createProductsService({
      productsRepository: repo as never
    });

    await expect(service.deleteProduct("seller-1", "p-1")).rejects.toThrow(
      ProductNotFoundError
    );
  });

  it("throws UnauthorizedError when seller does not own the product", async () => {
    const repo = makeProductsRepo({
      findActiveById: vi
        .fn()
        .mockResolvedValue({ ...fakeProductRaw, sellerId: "other-seller" })
    });
    const service = createProductsService({
      productsRepository: repo as never
    });

    await expect(service.deleteProduct("seller-1", "p-1")).rejects.toThrow(
      UnauthorizedError
    );
  });

  it("calls deactivateById when ownership is confirmed", async () => {
    const repo = makeProductsRepo({
      findActiveById: vi.fn().mockResolvedValue(fakeProductRaw),
      deactivateById: vi.fn().mockResolvedValue(undefined)
    });
    const service = createProductsService({
      productsRepository: repo as never
    });

    await service.deleteProduct("seller-1", "p-1");
    expect(repo.deactivateById).toHaveBeenCalledWith("p-1");
  });
});

describe("productsService.createBulkProducts", () => {
  it("injects sellerId into each product and returns count", async () => {
    const repo = makeProductsRepo({
      createManyProducts: vi.fn().mockResolvedValue({ count: 2 })
    });
    const service = createProductsService({
      productsRepository: repo as never
    });

    const products = [
      {
        name: "A",
        price: 10,
        description: "desc a",
        imageUrl: "https://a.com/img.jpg"
      },
      {
        name: "B",
        price: 20,
        description: "desc b",
        imageUrl: "https://b.com/img.jpg"
      }
    ];

    const count = await service.createBulkProducts("seller-1", products);

    expect(count).toBe(2);
    expect(repo.createManyProducts).toHaveBeenCalledWith([
      expect.objectContaining({ sellerId: "seller-1", name: "A" }),
      expect.objectContaining({ sellerId: "seller-1", name: "B" })
    ]);
  });
});
