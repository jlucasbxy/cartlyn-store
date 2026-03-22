import { z } from "zod";

export type RateLimitTier = "STRICTEST" | "STRICT" | "MODERATE" | "DEFAULT";

const n = () => z.coerce.number().int().positive();

const parsed = z
  .object({
    RATE_LIMIT_STRICTEST_POINTS: n().default(5),
    RATE_LIMIT_STRICTEST_DURATION: n().default(900),
    RATE_LIMIT_STRICT_POINTS: n().default(10),
    RATE_LIMIT_STRICT_DURATION: n().default(900),
    RATE_LIMIT_MODERATE_POINTS: n().default(20),
    RATE_LIMIT_MODERATE_DURATION: n().default(60),
    RATE_LIMIT_DEFAULT_POINTS: n().default(60),
    RATE_LIMIT_DEFAULT_DURATION: n().default(60)
  })
  .parse(process.env);

export const rateLimiterConfig = {
  STRICTEST: { points: parsed.RATE_LIMIT_STRICTEST_POINTS, duration: parsed.RATE_LIMIT_STRICTEST_DURATION },
  STRICT: { points: parsed.RATE_LIMIT_STRICT_POINTS, duration: parsed.RATE_LIMIT_STRICT_DURATION },
  MODERATE: { points: parsed.RATE_LIMIT_MODERATE_POINTS, duration: parsed.RATE_LIMIT_MODERATE_DURATION },
  DEFAULT: { points: parsed.RATE_LIMIT_DEFAULT_POINTS, duration: parsed.RATE_LIMIT_DEFAULT_DURATION }
} satisfies Record<RateLimitTier, { points: number; duration: number }>;
