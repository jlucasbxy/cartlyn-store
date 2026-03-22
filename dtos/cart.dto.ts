import type { SellerDTO } from "@/dtos/product.dto";

export type CartProductBaseDTO = {
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

export type CartProductDTO = CartProductBaseDTO & {
  seller: SellerDTO;
};

export type CartItemBaseDTO = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: CartProductBaseDTO;
};

export type CartItemDTO = Omit<CartItemBaseDTO, "product"> & {
  product: CartProductDTO;
};

export type CartDTO = {
  items: CartItemDTO[];
  total: number;
};

export type AddToCartDTO = {
  productId: string;
  quantity: number;
};

export type UpdateCartItemDTO = {
  quantity: number;
};
