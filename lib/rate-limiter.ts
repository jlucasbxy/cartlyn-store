import {
  RateLimiterMemory,
  RateLimiterRedis,
  RateLimiterRes
} from "rate-limiter-flexible";
import {
  type RateLimitTier,
  rateLimiterConfig
} from "@/config/rate-limiter.config";

type RateLimiter = RateLimiterMemory | RateLimiterRedis;

function createLimiters(): Record<RateLimitTier, RateLimiter> {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    // Dynamic import avoids bundling ioredis when REDIS_URL is not set
    // biome-ignore lint/suspicious/noRequireImports: dynamic conditional import
    const Redis = require("ioredis");
    const redis = new Redis(redisUrl);

    return Object.fromEntries(
      Object.entries(rateLimiterConfig).map(([tier, cfg]) => [
        tier,
        new RateLimiterRedis({
          storeClient: redis,
          keyPrefix: `rl:${tier}`,
          ...cfg,
          insuranceLimiter: new RateLimiterMemory(cfg)
        })
      ])
    ) as Record<RateLimitTier, RateLimiterRedis>;
  }

  return Object.fromEntries(
    Object.entries(rateLimiterConfig).map(([tier, cfg]) => [
      tier,
      new RateLimiterMemory(cfg)
    ])
  ) as Record<RateLimitTier, RateLimiterMemory>;
}

const limiters = createLimiters();

export type RateLimitResult =
  | { allowed: true; limit: number; remaining: number }
  | { allowed: false; limit: number; retryAfterSeconds: number };

export async function checkRateLimit(
  ip: string,
  tier: RateLimitTier
): Promise<RateLimitResult> {
  const limiter = limiters[tier];
  const { points } = rateLimiterConfig[tier];
  try {
    const res = await limiter.consume(ip);
    return { allowed: true, limit: points, remaining: res.remainingPoints };
  } catch (err) {
    if (err instanceof RateLimiterRes) {
      return {
        allowed: false,
        limit: points,
        retryAfterSeconds: Math.ceil(err.msBeforeNext / 1000)
      };
    }
    throw err;
  }
}
