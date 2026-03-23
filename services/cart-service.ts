import { Prisma } from "@prisma/client";
import type { CartDTO, CartItemBaseDTO } from "@/dtos";
import {
  CartItemNotFoundError,
  ProductNotFoundOrUnavailableError
} from "@/errors";
import { toNumber } from "@/lib/price";
import { createCartRepository } from "@/repositories/cart-repository";
import { createProductsRepository } from "@/repositories/products-repository";

type Deps = {
  cartRepository: ReturnType<typeof createCartRepository>;
  productsRepository: ReturnType<typeof createProductsRepository>;
};

export function createCartService(deps: Deps) {
  async function getCart(userId: string): Promise<CartDTO> {
    const cartItems = await deps.cartRepository.findUserCartForDisplay(userId);

    const total = cartItems
      .reduce(
        (sum, item) => sum.plus(item.product.price.mul(item.quantity)),
        new Prisma.Decimal(0)
      )
      .toNumber();

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
    const exists = await deps.productsRepository.checkActiveExists(productId);

    if (!exists) {
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
