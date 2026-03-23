"use server";

import { DomainError } from "@/errors";
import { logger } from "@/lib/logger";
import { checkActionRateLimit } from "@/lib/server/action-rate-limit";
import { registerSchema } from "@/schemas";
import { registerService } from "@/services";
import type { ActionResult } from "./types";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: "CLIENT" | "SELLER";
}): Promise<ActionResult> {
  const rateLimit = await checkActionRateLimit("STRICT");
  if (!rateLimit.allowed) return { error: rateLimit.error };

  const validated = registerSchema.safeParse(data);
  if (!validated.success) return { error: "Dados inválidos" };
  try {
    await registerService.registerUser(validated.data);
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "registerUser failed");
    return { error: "Erro ao criar conta" };
  }
}
