import { Prisma } from "@prisma/client";
import { ErrorCode } from "@/dtos";
import type { CartDTO, CartItemBaseDTO } from "@/dtos";
import { NotFoundError } from "@/errors";
import { toNumber } from "@/lib";
import { cartRepository, productsRepository } from "@/repositories";

async function getCart(userId: string): Promise<CartDTO> {
  const cartItems = await cartRepository.findUserCart(userId);

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
  const product = await productsRepository.findById(productId);

  if (!product || !product.active) {
    throw new NotFoundError(ErrorCode.PRODUCT_NOT_FOUND_OR_UNAVAILABLE, "Produto não encontrado ou indisponível");
  }

  const cartItem = await cartRepository.upsertItem(userId, productId, quantity);

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
    const cartItem = await cartRepository.updateQuantity(
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
      throw new NotFoundError(ErrorCode.CART_ITEM_NOT_FOUND, "Item não encontrado no carrinho");
    }

    throw error;
  }
}

async function removeFromCart(userId: string, productId: string) {
  try {
    await cartRepository.deleteItem(userId, productId);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError(ErrorCode.CART_ITEM_NOT_FOUND, "Item não encontrado no carrinho");
    }

    throw error;
  }
}

export const cartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};
