import type {
  CreateProductDTO,
  ProductBaseDTO,
  ProductDTO,
  ProductListDTO,
  SearchProductsDTO,
  UpdateProductDTO
} from "@/dtos";

export type SearchProductsFilters = SearchProductsDTO & { sellerId?: string };

export interface ProductsService {
  getProducts(filters: SearchProductsFilters): Promise<ProductListDTO>;
  getProductById(id: string): Promise<ProductDTO>;
  createProduct(
    sellerId: string,
    data: CreateProductDTO
  ): Promise<ProductBaseDTO>;
  updateProduct(
    sellerId: string,
    productId: string,
    data: UpdateProductDTO
  ): Promise<ProductBaseDTO>;
  deleteProduct(sellerId: string, productId: string): Promise<void>;
  createBulkProducts(
    sellerId: string,
    products: CreateProductDTO[]
  ): Promise<number>;
}
