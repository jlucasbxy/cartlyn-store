export type RateLimitTier = "STRICTEST" | "STRICT" | "MODERATE" | "DEFAULT";

export const rateLimiterConfig = {
	STRICTEST: { points: 5, duration: 15 * 60 },
	STRICT: { points: 10, duration: 15 * 60 },
	MODERATE: { points: 20, duration: 60 },
	DEFAULT: { points: 60, duration: 60 },
} satisfies Record<RateLimitTier, { points: number; duration: number }>;
