import { Prisma } from "@prisma/client";
import type { CartDTO, CartItemBaseDTO } from "@/dtos";
import {
  CartItemNotFoundError,
  ProductNotFoundOrUnavailableError
} from "@/errors";
import { toNumber } from "@/lib";
import { cartRepository, productsRepository } from "@/repositories";

type Deps = {
  cartRepository: typeof cartRepository;
  productsRepository: typeof productsRepository;
};

export function createCartService(deps: Deps) {
  async function getCart(userId: string): Promise<CartDTO> {
    const cartItems = await deps.cartRepository.findUserCart(userId);

    const total = cartItems.reduce(
      (sum, item) => sum + toNumber(item.product.price) * item.quantity,
      0
    );

    return {
      items: cartItems.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: toNumber(item.product.price)
        }
      })),
      total
    };
  }

  async function addToCart(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<CartItemBaseDTO> {
    const product = await deps.productsRepository.findById(productId);

    if (!product || !product.active) {
      throw new ProductNotFoundOrUnavailableError();
    }

    const cartItem = await deps.cartRepository.upsertItem(
      userId,
      productId,
      quantity
    );

    return {
      ...cartItem,
      product: {
        ...cartItem.product,
        price: toNumber(cartItem.product.price)
      }
    };
  }

  async function updateCartItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<CartItemBaseDTO> {
    try {
      const cartItem = await deps.cartRepository.updateQuantity(
        userId,
        productId,
        quantity
      );

      return {
        ...cartItem,
        product: {
          ...cartItem.product,
          price: toNumber(cartItem.product.price)
        }
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new CartItemNotFoundError();
      }

      throw error;
    }
  }

  async function removeFromCart(userId: string, productId: string) {
    try {
      await deps.cartRepository.deleteItem(userId, productId);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new CartItemNotFoundError();
      }

      throw error;
    }
  }

  return { getCart, addToCart, updateCartItem, removeFromCart };
}

export const cartService = createCartService({
  cartRepository,
  productsRepository
});
