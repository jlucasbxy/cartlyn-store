import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib";
import { productsService } from "@/services";
import { SellerProductsClient } from "./seller-products-client";

export const metadata: Metadata = {
  title: "Meus Produtos - Cartlyn Store",
  description: "Gerencie seus produtos"
};

export default async function SellerProductsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "SELLER") {
    redirect("/");
  }

  const { products, pagination } = await productsService.getProducts({
    sellerId: session.user.id,
    limit: 10
  });

  const initialProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.description,
    imageUrl: p.imageUrl,
    active: p.active,
    publishedAt: p.publishedAt.toISOString()
  }));

  return (
    <SellerProductsClient
      initialProducts={initialProducts}
      initialPagination={pagination}
    />
  );
}
