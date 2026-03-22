import type { SellerDTO } from "@/dtos/product.dto";

export type FavoriteProductDTO = {
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
  seller: SellerDTO;
};

export type FavoriteDTO = {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
  product: FavoriteProductDTO;
};

export type CreateFavoriteDTO = {
  productId: string;
};
