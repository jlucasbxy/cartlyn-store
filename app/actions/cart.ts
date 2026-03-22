"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { DomainError } from "@/errors";
import { auth } from "@/lib/server";
import { logger } from "@/lib/logger";
import { cartService, ordersService } from "@/services";
import type { ActionResult } from "./types";

export async function addToCart(
  productId: string,
  quantity: number
): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Nao autenticado" };
  try {
    await cartService.addToCart(session.user.id, productId, quantity);
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
  const session = await auth();
  if (!session) return { error: "Nao autenticado" };
  try {
    await cartService.updateCartItem(session.user.id, productId, quantity);
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "updateCartItem failed");
    return { error: "Erro inesperado" };
  }
}

export async function removeFromCart(productId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Nao autenticado" };
  try {
    await cartService.removeFromCart(session.user.id, productId);
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "removeFromCart failed");
    return { error: "Erro inesperado" };
  }
}

export async function checkout(): Promise<ActionResult | never> {
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
  redirect("/orders");
}
