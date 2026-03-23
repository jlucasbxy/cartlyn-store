import path from "node:path";
import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https:",
  "form-action 'self'"
].join("; ");

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheHandlers: {
    default: path.resolve("./cache-handler.mjs"),
    remote: path.resolve("./cache-handler.mjs")
  },
  transpilePackages: ["swagger-ui-react"],
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin"
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains"
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), browsing-topics=()"
        },
        { key: "X-DNS-Prefetch-Control", value: "on" },
        ...(isProduction
          ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }]
          : [])
      ]
    }
  ]
};

export default nextConfig;
