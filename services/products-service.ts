import type { ProductBaseDTO, ProductDTO, ProductListDTO } from "@/dtos";
import { ProductNotFoundError, UnauthorizedError } from "@/errors";
import { toNumber } from "@/lib";
import { productsRepository } from "@/repositories";
import type {
  ProductInput,
  ProductUpdateInput,
  SearchProductsInput
} from "@/schemas";

type SearchProductsFilters = SearchProductsInput & {
  sellerId?: string;
};

async function getProducts(
  filters: SearchProductsFilters
): Promise<ProductListDTO> {
  const { products, nextCursor, hasNextPage } =
    await productsRepository.findProducts(filters);

  return {
    products: products.map((product) => ({
      ...product,
      price: toNumber(product.price)
    })),
    pagination: {
      limit: filters.limit,
      nextCursor,
      hasNextPage
    }
  };
}

async function getProductById(id: string): Promise<ProductDTO> {
  const product = await productsRepository.findVisibleById(id);

  if (!product) {
    throw new ProductNotFoundError();
  }

  return {
    ...product,
    price: toNumber(product.price)
  };
}

async function createProduct(
  sellerId: string,
  data: ProductInput
): Promise<ProductBaseDTO> {
  const product = await productsRepository.createProduct(sellerId, data);

  return {
    ...product,
    price: toNumber(product.price)
  };
}

async function updateProduct(
  sellerId: string,
  productId: string,
  data: ProductUpdateInput
): Promise<ProductBaseDTO> {
  const existingProduct = await productsRepository.findById(productId);

  if (!existingProduct) {
    throw new ProductNotFoundError();
  }

  if (existingProduct.sellerId !== sellerId) {
    throw new UnauthorizedError(ErrorCode.UNAUTHORIZED);
  }

  const product = await productsRepository.updateById(productId, data);

  return {
    ...product,
    price: toNumber(product.price)
  };
}

async function deleteProduct(sellerId: string, productId: string) {
  const existingProduct = await productsRepository.findById(productId);

  if (!existingProduct) {
    throw new ProductNotFoundError();
  }

  if (existingProduct.sellerId !== sellerId) {
    throw new UnauthorizedError(ErrorCode.UNAUTHORIZED);
  }

  await productsRepository.deactivateById(productId);
}

async function createBulkProducts(
  sellerId: string,
  products: Array<ProductInput>
) {
  const result = await productsRepository.createManyProducts(
    products.map((product) => ({ ...product, sellerId }))
  );

  return result.count;
}

export const productsService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createBulkProducts
};
