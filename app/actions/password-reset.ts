"use server";

import { logger } from "@/lib/logger";
import { checkActionRateLimit } from "@/lib/server/action-rate-limit";
import { forgotPasswordSchema, resetPasswordServerSchema } from "@/schemas";
import { passwordResetService } from "@/container";
import type { ActionResult } from "./types";

export async function requestPasswordReset(data: {
  email: string;
}): Promise<ActionResult> {
  const rateLimit = await checkActionRateLimit("STRICTEST");
  if (!rateLimit.allowed) return { error: rateLimit.error };

  const validated = forgotPasswordSchema.safeParse(data);
  if (!validated.success) return { error: "Email inválido" };

  try {
    await passwordResetService.requestReset(validated.data.email);
    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "requestPasswordReset failed");
    return { error: "Erro ao processar solicitação" };
  }
}

export async function resetPassword(data: {
  token: string;
  password: string;
}): Promise<ActionResult> {
  const rateLimit = await checkActionRateLimit("STRICT");
  if (!rateLimit.allowed) return { error: rateLimit.error };

  const validated = resetPasswordServerSchema.safeParse(data);
  if (!validated.success) return { error: "Dados inválidos" };

  try {
    const ok = await passwordResetService.resetPassword(
      validated.data.token,
      validated.data.password
    );

    if (!ok) return { error: "Link inválido ou expirado" };

    return { success: true };
  } catch (error) {
    logger.error({ err: error }, "resetPassword failed");
    return { error: "Erro ao redefinir senha" };
  }
}
