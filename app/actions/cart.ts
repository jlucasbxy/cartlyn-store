"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib";
import { cartService, ordersService } from "@/services";

export async function addToCart(productId: string, quantity: number) {
  const session = await auth();
  if (!session) throw new Error("Não autenticado");
  await cartService.addToCart(session.user.id, productId, quantity);
  revalidatePath("/cart");
}

export async function updateCartItem(productId: string, quantity: number) {
  const session = await auth();
  if (!session) throw new Error("Não autenticado");
  await cartService.updateCartItem(session.user.id, productId, quantity);
  revalidatePath("/cart");
}

export async function removeFromCart(productId: string) {
  const session = await auth();
  if (!session) throw new Error("Não autenticado");
  await cartService.removeFromCart(session.user.id, productId);
  revalidatePath("/cart");
}

export async function checkout() {
  const session = await auth();
  if (!session) throw new Error("Não autenticado");
  await ordersService.checkout(session.user.id);
  revalidatePath("/cart");
  redirect("/orders");
}
