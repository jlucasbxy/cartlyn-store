import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/server";
import { productsService } from "@/container";
import { SellerProductsClient } from "./seller-products-client";

export const metadata: Metadata = {
  title: "Meus Produtos - Cartlyn Store",
  description: "Gerencie seus produtos"
};

export default async function SellerProductsPage({
  searchParams
}: {
  searchParams: Promise<{ cursor?: string }>;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "SELLER") {
    redirect("/");
  }

  const { cursor } = await searchParams;

  const { products, pagination } = await productsService.getProducts({
    sellerId: session.user.id,
    limit: 10,
    cursor
  });

  const mappedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.description,
    imageUrl: p.imageUrl,
    active: p.active,
    publishedAt: p.publishedAt.toISOString()
  }));

  return (
    <SellerProductsClient products={mappedProducts} pagination={pagination} />
  );
}
