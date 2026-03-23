import "server-only";

import { headers } from "next/headers";
import type { RateLimitTier } from "@/config/rate-limiter.config";
import { checkRateLimit } from "@/lib/rate-limiter";
import { logger } from "@/lib/logger";

type ActionRateLimitResult =
  | { allowed: true }
  | { allowed: false; error: string };

function getIpFromHeaders(headerStore: Headers): string {
  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown"
  );
}

export async function checkActionRateLimit(
  tier: RateLimitTier
): Promise<ActionRateLimitResult> {
  try {
    const headerStore = await headers();
    const ip = getIpFromHeaders(headerStore);
    const result = await checkRateLimit(ip, tier);

    if (result.allowed) {
      return { allowed: true };
    }

    return {
      allowed: false,
      error: `Muitas tentativas. Tente novamente em ${result.retryAfterSeconds}s.`
    };
  } catch (error) {
    logger.error({ err: error }, "checkActionRateLimit failed");
    return {
      allowed: false,
      error: "Não foi possível processar agora. Tente novamente em instantes."
    };
  }
}
