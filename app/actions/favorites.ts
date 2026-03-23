"use server";

import { revalidatePath } from "next/cache";
import { DomainError } from "@/errors";
import { logger } from "@/lib/logger";
import { auth } from "@/lib/server";
import { favoriteSchema } from "@/schemas";
import { favoritesService } from "@/container";
import type { ActionResult } from "./types";

export async function addFavorite(productId: string): Promise<ActionResult> {
  const validated = favoriteSchema.safeParse({ productId });
  if (!validated.success) return { error: "Dados inválidos" };
  const session = await auth();
  if (!session) return { error: "Nao autenticado" };
  try {
    await favoritesService.addFavorite(
      session.user.id,
      validated.data.productId
    );
    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "addFavorite failed");
    return { error: "Erro inesperado" };
  }
}

export async function removeFavorite(productId: string): Promise<ActionResult> {
  const validated = favoriteSchema.safeParse({ productId });
  if (!validated.success) return { error: "Dados inválidos" };
  const session = await auth();
  if (!session) return { error: "Nao autenticado" };
  try {
    await favoritesService.removeFavorite(
      session.user.id,
      validated.data.productId
    );
    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "removeFavorite failed");
    return { error: "Erro inesperado" };
  }
}
