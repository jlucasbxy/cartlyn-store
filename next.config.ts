import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheHandler: "./cache-handler.js",
  cacheMaxMemorySize: 0,
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
