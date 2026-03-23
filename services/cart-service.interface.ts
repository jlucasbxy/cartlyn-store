import type { CartDTO, CartItemBaseDTO } from "@/dtos";

export interface CartService {
  getCart(userId: string): Promise<CartDTO>;
  addToCart(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<CartItemBaseDTO>;
  updateCartItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<CartItemBaseDTO>;
  removeFromCart(userId: string, productId: string): Promise<void>;
}
