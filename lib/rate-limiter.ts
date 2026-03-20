import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import { rateLimiterConfig, type RateLimitTier } from "@/config/rate-limiter.config";

// To migrate to Redis: replace RateLimiterMemory with RateLimiterRedis
// and pass an ioredis client. The checkRateLimit function stays unchanged.
const limiters = Object.fromEntries(
	Object.entries(rateLimiterConfig).map(([tier, cfg]) => [
		tier,
		new RateLimiterMemory(cfg),
	]),
) as Record<RateLimitTier, RateLimiterMemory>;

export type RateLimitResult =
	| { allowed: true; limit: number; remaining: number }
	| { allowed: false; limit: number; retryAfterSeconds: number };

export async function checkRateLimit(
	ip: string,
	tier: RateLimitTier,
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
				retryAfterSeconds: Math.ceil(err.msBeforeNext / 1000),
			};
		}
		throw err;
	}
}
