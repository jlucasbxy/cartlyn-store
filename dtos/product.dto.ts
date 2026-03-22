export type SellerDTO = {
  id: string;
  name: string;
};

export type ProductBaseDTO = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  publishedAt: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  sellerId: string;
};

export type ProductDTO = ProductBaseDTO & {
  seller: SellerDTO;
};

export type CursorPaginationDTO = {
  limit: number;
  nextCursor: string | null;
  hasNextPage: boolean;
};

export type ProductListDTO = {
  products: ProductDTO[];
  pagination: CursorPaginationDTO;
};

export type ProductInput = {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
};

export type ProductUpdateInput = {
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
};

export type SearchProductsInput = {
  query?: string;
  cursor?: string;
  limit: number;
  minPrice?: number;
  maxPrice?: number;
};

export type CsvProductInput = {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
};
