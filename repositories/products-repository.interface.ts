import type { Prisma, Product } from "@prisma/client";
import type { ProductSearchFilters } from "./products-repository";

type ProductWithSeller = Prisma.ProductGetPayload<{
  include: { seller: { select: { id: true; name: true } } };
}>;

export interface ProductsRepository {
  findProducts(filters: ProductSearchFilters): Promise<{
    products: ProductWithSeller[];
    nextCursor: string | null;
    hasNextPage: boolean;
  }>;
  createProduct(
    sellerId: string,
    data: {
      name: string;
      price: number;
      description: string;
      imageUrl: string;
    }
  ): Promise<Product>;
  findVisibleById(id: string): Promise<ProductWithSeller | null>;
  checkActiveExists(id: string): Promise<boolean>;
  findActiveById(id: string): Promise<{ id: string; sellerId: string } | null>;
  updateById(
    id: string,
    data: {
      name?: string;
      price?: number;
      description?: string;
      imageUrl?: string;
    }
  ): Promise<Product>;
  deactivateById(id: string): Promise<Product>;
  createManyProducts(
    data: Array<{
      name: string;
      price: number;
      description: string;
      imageUrl: string;
      sellerId: string;
    }>
  ): Promise<Prisma.BatchPayload>;
  deactivateAllBySeller(sellerId: string): Promise<Prisma.BatchPayload>;
  countBySeller(sellerId: string): Promise<number>;
  findBasicById(
    id: string
  ): Promise<Pick<Product, "id" | "name" | "price" | "imageUrl"> | null>;
}
