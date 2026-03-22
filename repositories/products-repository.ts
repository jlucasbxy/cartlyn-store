import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/prisma";
import type {
  CreateProductDTO,
  SearchProductsDTO,
  UpdateProductDTO
} from "@/dtos";

export type ProductSearchFilters = SearchProductsDTO & {
  sellerId?: string;
};

const sellerSelect = {
  id: true,
  name: true
} satisfies Prisma.UserSelect;

const productWithSellerInclude = {
  seller: {
    select: sellerSelect
  }
} satisfies Prisma.ProductInclude;

type Deps = {
  prisma: PrismaClient;
};

export function createProductsRepository(deps: Deps) {
  function buildProductsWhere(
    filters: ProductSearchFilters
  ): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {
      active: true,
      seller: {
        active: true
      }
    };

    if (filters.sellerId) {
      where.sellerId = filters.sellerId;
    }

    if (filters.query) {
      where.OR = [
        { name: { contains: filters.query, mode: "insensitive" } },
        { description: { contains: filters.query, mode: "insensitive" } }
      ];
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};

      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }

      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    return where;
  }

  async function findProducts(filters: ProductSearchFilters) {
    const where = buildProductsWhere(filters);
    const take = filters.limit + 1;

    const products = await deps.prisma.product.findMany({
      where,
      take,
      skip: filters.cursor ? 1 : 0,
      cursor: filters.cursor ? { id: filters.cursor } : undefined,
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      include: productWithSellerInclude
    });

    const hasNextPage = products.length > filters.limit;
    if (hasNextPage) products.pop();
    const nextCursor = hasNextPage ? products[products.length - 1].id : null;

    return { products, nextCursor, hasNextPage };
  }

  function createProduct(sellerId: string, data: CreateProductDTO) {
    return deps.prisma.product.create({
      data: {
        ...data,
        sellerId
      }
    });
  }

  function findVisibleById(id: string) {
    return deps.prisma.product.findFirst({
      where: {
        id,
        active: true,
        seller: {
          active: true
        }
      },
      include: productWithSellerInclude
    });
  }

  function findById(id: string) {
    return deps.prisma.product.findUnique({
      where: { id }
    });
  }

  function updateById(id: string, data: UpdateProductDTO) {
    return deps.prisma.product.update({
      where: { id },
      data
    });
  }

  function deactivateById(id: string) {
    return deps.prisma.product.update({
      where: { id },
      data: { active: false }
    });
  }

  function createManyProducts(
    data: Array<CreateProductDTO & { sellerId: string }>
  ) {
    return deps.prisma.product.createMany({
      data,
      skipDuplicates: true
    });
  }

  function countBySeller(sellerId: string) {
    return deps.prisma.product.count({
      where: { sellerId }
    });
  }

  function findBasicById(id: string) {
    return deps.prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true
      }
    });
  }

  return {
    findProducts,
    createProduct,
    findVisibleById,
    findById,
    updateById,
    deactivateById,
    createManyProducts,
    countBySeller,
    findBasicById
  };
}

export const productsRepository = createProductsRepository({ prisma });
