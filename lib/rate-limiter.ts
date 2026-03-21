import Redis from "ioredis";
import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import { env } from "@/config/env.config";
import {
  type RateLimitTier,
  rateLimiterConfig
} from "@/config/rate-limiter.config";

function createLimiters(): Record<RateLimitTier, RateLimiterRedis> {
  const redis = new Redis(env.redisUrl);

  return Object.fromEntries(
    Object.entries(rateLimiterConfig).map(([tier, cfg]) => [
      tier,
      new RateLimiterRedis({
        storeClient: redis,
        keyPrefix: `rl:${tier}`,
        ...cfg
      })
    ])
  ) as Record<RateLimitTier, RateLimiterRedis>;
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
