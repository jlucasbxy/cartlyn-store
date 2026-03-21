"use server";

import { DomainError } from "@/errors";
import { auth } from "@/lib";
import { logger } from "@/lib/logger";
import { favoritesService } from "@/services";
import type { ActionResult } from "./types";

export async function addFavorite(productId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Nao autenticado" };
  try {
    await favoritesService.addFavorite(session.user.id, productId);
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "addFavorite failed");
    return { error: "Erro inesperado" };
  }
}

export async function removeFavorite(productId: string): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Nao autenticado" };
  try {
    await favoritesService.removeFavorite(session.user.id, productId);
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "removeFavorite failed");
    return { error: "Erro inesperado" };
  }
}
