import { NextResponse } from "next/server";
import { handleServiceError } from "@/lib/server";
import { productsService } from "@/services";

// Get single product
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await productsService.getProductById(id);
    return NextResponse.json(product, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
      }
    });
  } catch (error) {
    return handleServiceError(error, "Erro ao buscar produto");
  }
}
