import type { MetadataRoute } from "next";
import { env } from "@/config/env.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cart", "/orders", "/settings", "/seller/"]
    },
    sitemap: `${env.nextAuthUrl}/sitemap.xml`
  };
}
