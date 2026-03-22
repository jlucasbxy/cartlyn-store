"use server";

import { DomainError } from "@/errors";
import { logger } from "@/lib/logger";
import { auth } from "@/lib/server";
import { accountService } from "@/services";
import type { ActionResult } from "./types";

export async function deactivateOrDeleteAccount(): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { error: "Não autenticado" };
  try {
    await accountService.deactivateOrDeleteAccount(
      session.user.id,
      session.user.role
    );
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "deactivateOrDeleteAccount failed");
    return { error: "Erro ao processar solicitação" };
  }
}
