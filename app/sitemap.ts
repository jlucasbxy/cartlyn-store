import type { MetadataRoute } from "next";
import { env } from "@/config/env.config";
import { productsService } from "@/container";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.nextAuthUrl;

  const { products } = await productsService.getProducts({ limit: 100 });

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: product.updatedAt
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/store`, lastModified: new Date() },
    { url: `${baseUrl}/login`, lastModified: new Date() },
    { url: `${baseUrl}/register`, lastModified: new Date() },
    ...productUrls
  ];
}
