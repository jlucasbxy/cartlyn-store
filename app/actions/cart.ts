"use server";

import { revalidatePath } from "next/cache";
import { DomainError } from "@/errors";
import { logger } from "@/lib/logger";
import { auth } from "@/lib/server";
import { addToCartSchema, favoriteSchema } from "@/schemas";
import { cartService, ordersService } from "@/container";
import type { ActionResult } from "./types";

export async function addToCart(
  productId: string,
  quantity: number
): Promise<ActionResult> {
  const validated = addToCartSchema.safeParse({ productId, quantity });
  if (!validated.success) return { error: "Dados inválidos" };
  const session = await auth();
  if (!session) return { error: "Nao autenticado" };
  try {
    await cartService.addToCart(
      session.user.id,
      validated.data.productId,
      validated.data.quantity
    );
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "addToCart failed");
    return { error: "Erro inesperado" };
  }
}

export async function updateCartItem(
  productId: string,
  quantity: number
): Promise<ActionResult> {
  const validated = addToCartSchema.safeParse({ productId, quantity });
  if (!validated.success) return { error: "Dados inválidos" };
  const session = await auth();
  if (!session) return { error: "Nao autenticado" };
  try {
    await cartService.updateCartItem(
      session.user.id,
      validated.data.productId,
      validated.data.quantity
    );
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "updateCartItem failed");
    return { error: "Erro inesperado" };
  }
}

export async function removeFromCart(productId: string): Promise<ActionResult> {
  const validated = favoriteSchema.safeParse({ productId });
  if (!validated.success) return { error: "Dados inválidos" };
  const session = await auth();
  if (!session) return { error: "Nao autenticado" };
  try {
    await cartService.removeFromCart(session.user.id, validated.data.productId);
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "removeFromCart failed");
    return { error: "Erro inesperado" };
  }
}

export async function checkout(): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Nao autenticado" };
  try {
    await ordersService.checkout(session.user.id);
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "checkout failed");
    return { error: "Erro inesperado" };
  }
  revalidatePath("/cart");
  return { success: true };
}
