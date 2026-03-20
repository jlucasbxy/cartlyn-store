export const runtime = "nodejs";

import { type NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import type { RateLimitTier } from "@/config/rate-limiter.config";

type RouteRule = {
	method?: string;
	pathname: string;
	tier: RateLimitTier;
};

const routeRules: RouteRule[] = [
	{ method: "POST", pathname: "/api/auth/callback/credentials", tier: "STRICTEST" },
	{ method: "POST", pathname: "/api/auth/register", tier: "STRICT" },
	{ method: "POST", pathname: "/api/orders", tier: "MODERATE" },
	{ method: "POST", pathname: "/api/products/bulk", tier: "MODERATE" },
];

function getTier(request: NextRequest): RateLimitTier {
	const { pathname } = request.nextUrl;
	const method = request.method;

	for (const rule of routeRules) {
		if (rule.method && rule.method !== method) continue;
		if (pathname === rule.pathname) return rule.tier;
	}

	return "DEFAULT";
}

function getIp(request: NextRequest): string {
	return (
		request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
		request.headers.get("x-real-ip") ??
		"unknown"
	);
}

export async function middleware(request: NextRequest) {
	const ip = getIp(request);
	const tier = getTier(request);
	const result = await checkRateLimit(ip, tier);

	if (!result.allowed) {
		return NextResponse.json(
			{ error: "Too Many Requests" },
			{
				status: 429,
				headers: {
					"Retry-After": String(result.retryAfterSeconds),
					"X-RateLimit-Limit": String(result.limit),
					"X-RateLimit-Remaining": "0",
				},
			},
		);
	}

	const response = NextResponse.next();
	response.headers.set("X-RateLimit-Limit", String(result.limit));
	response.headers.set("X-RateLimit-Remaining", String(result.remaining));
	return response;
}

export const config = {
	matcher: ["/api/:path*"],
};
