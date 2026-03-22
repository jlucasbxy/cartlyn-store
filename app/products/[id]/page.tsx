import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import type { ProductDTO } from "@/dtos";
import { NotFoundError } from "@/errors";
import { auth } from "@/lib/server";
import { favoritesService, productsService } from "@/services";
import { ProductDetailsClient } from "./product-details-client";

const getCachedProduct = unstable_cache(
  (id: string) => productsService.getProductById(id),
  ["product-by-id"],
  { revalidate: 60, tags: ["products"] }
);

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getCachedProduct(id);
    return {
      title: `${product.name} - Cartlyn Store`,
      description: product.description.slice(0, 160)
    };
  } catch {
    return {
      title: "Produto nao encontrado - Cartlyn Store"
    };
  }
}

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: ProductDTO;
  try {
    product = await getCachedProduct(id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      redirect("/store");
    }
    throw error;
  }

  const session = await auth();

  let isFavorite = false;
  if (session) {
    const favorites = await favoritesService.getFavorites(session.user.id);
    isFavorite = favorites.some((fav) => fav.product.id === product.id);
  }

  return (
    <ProductDetailsClient
      product={{ ...product, publishedAt: new Date(product.publishedAt).toISOString() }}
      role={session?.user.role}
      isFavorite={isFavorite}
    />
  );
}
