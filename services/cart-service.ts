import { Prisma } from "@prisma/client";
import type { CartDTO, CartItemBaseDTO } from "@/dtos";
import { toNumber } from "@/lib/price";
import { cartRepository } from "@/repositories/cart-repository";
import { productsRepository } from "@/repositories/products-repository";
import { ServiceError } from "@/services/service-error";

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
    throw new ServiceError("Produto não encontrado ou indisponível", 404);
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
      throw new ServiceError("Item não encontrado no carrinho", 404);
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
      throw new ServiceError("Item não encontrado no carrinho", 404);
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
