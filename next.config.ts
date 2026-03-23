import path from "node:path";
import type { NextConfig } from "next";

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
        { key: "X-DNS-Prefetch-Control", value: "on" }
      ]
    }
  ]
};

export default nextConfig;
