import { redirect } from "next/navigation";
import type { ProductDTO } from "@/dtos";
import { auth } from "@/lib";
import { NotFoundError } from "@/errors";
import { productsService } from "@/services";
import { ProductDetailsClient } from "./product-details-client";

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: ProductDTO;
  try {
    product = await productsService.getProductById(id);
  } catch (error) {
    if (error instanceof NotFoundError) {
      redirect("/store");
    }
    throw error;
  }

  const session = await auth();

  return (
    <ProductDetailsClient
      product={{ ...product, publishedAt: product.publishedAt.toISOString() }}
      role={session?.user.role}
    />
  );
}
