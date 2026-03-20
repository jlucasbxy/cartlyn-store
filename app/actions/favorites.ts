"use server";

import { auth } from "@/lib/auth";
import { favoritesService } from "@/services/favorites-service";

export async function addFavorite(productId: string) {
  const session = await auth();
  if (!session) throw new Error("Não autenticado");
  await favoritesService.addFavorite(session.user.id, productId);
}

export async function removeFavorite(productId: string) {
  const session = await auth();
  if (!session) throw new Error("Não autenticado");
  await favoritesService.removeFavorite(session.user.id, productId);
}
