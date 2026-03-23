import { Prisma } from "@prisma/client";

import { ProductAlreadyFavoritedError, ProductNotFoundError } from "@/errors";
import { createFavoritesService } from "@/services/favorites-service";

function makeFavoritesRepo(overrides = {}) {
  return {
    findUserFavorites: vi.fn(),
    createFavorite: vi.fn(),
    deleteFavorite: vi.fn(),
    ...overrides
  };
}

function makeProductsRepo(overrides = {}) {
  return {
    checkActiveExists: vi.fn(),
    ...overrides
  };
}

describe("favoritesService.getFavorites", () => {
  it("returns favorites with price as number", async () => {
    const favoritesRepo = makeFavoritesRepo({
      findUserFavorites: vi.fn().mockResolvedValue([
        {
          id: "fav-1",
          userId: "u-1",
          productId: "p-1",
          product: {
            id: "p-1",
            name: "Widget",
            price: new Prisma.Decimal("15.00"),
            imageUrl: ""
          }
        }
      ])
    });
    const service = createFavoritesService({
      favoritesRepository: favoritesRepo as never,
      productsRepository: makeProductsRepo() as never
    });

    const favorites = await service.getFavorites("u-1");

    expect(favorites[0].product.price).toBe(15);
  });
});

describe("favoritesService.addFavorite", () => {
  it("throws ProductNotFoundError when product does not exist", async () => {
    const productsRepo = makeProductsRepo({
      checkActiveExists: vi.fn().mockResolvedValue(false)
    });
    const service = createFavoritesService({
      favoritesRepository: makeFavoritesRepo() as never,
      productsRepository: productsRepo as never
    });

    await expect(service.addFavorite("u-1", "p-1")).rejects.toThrow(
      ProductNotFoundError
    );
  });

  it("creates a favorite when product exists", async () => {
    const favorite = { id: "fav-1", userId: "u-1", productId: "p-1" };
    const favoritesRepo = makeFavoritesRepo({
      createFavorite: vi.fn().mockResolvedValue(favorite)
    });
    const productsRepo = makeProductsRepo({
      checkActiveExists: vi.fn().mockResolvedValue(true)
    });
    const service = createFavoritesService({
      favoritesRepository: favoritesRepo as never,
      productsRepository: productsRepo as never
    });

    const result = await service.addFavorite("u-1", "p-1");

    expect(result).toEqual(favorite);
    expect(favoritesRepo.createFavorite).toHaveBeenCalledWith("u-1", "p-1");
  });

  it("throws ProductAlreadyFavoritedError on Prisma P2002", async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "unique constraint",
      {
        code: "P2002",
        clientVersion: "5.0.0"
      }
    );
    const favoritesRepo = makeFavoritesRepo({
      createFavorite: vi.fn().mockRejectedValue(prismaError)
    });
    const productsRepo = makeProductsRepo({
      checkActiveExists: vi.fn().mockResolvedValue(true)
    });
    const service = createFavoritesService({
      favoritesRepository: favoritesRepo as never,
      productsRepository: productsRepo as never
    });

    await expect(service.addFavorite("u-1", "p-1")).rejects.toThrow(
      ProductAlreadyFavoritedError
    );
  });
});

describe("favoritesService.removeFavorite", () => {
  it("delegates to the repository", async () => {
    const favoritesRepo = makeFavoritesRepo({
      deleteFavorite: vi.fn().mockResolvedValue(undefined)
    });
    const service = createFavoritesService({
      favoritesRepository: favoritesRepo as never,
      productsRepository: makeProductsRepo() as never
    });

    await service.removeFavorite("u-1", "p-1");

    expect(favoritesRepo.deleteFavorite).toHaveBeenCalledWith("u-1", "p-1");
  });
});
