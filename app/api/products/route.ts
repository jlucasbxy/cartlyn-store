import { type NextRequest, NextResponse } from "next/server";
import { handleServiceError } from "@/lib/server";
import { searchProductsSchema } from "@/schemas";
import { productsService } from "@/container";

// Get products (with search and pagination)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || undefined;
    const cursor = searchParams.get("cursor") || undefined;
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;
    const sellerId = searchParams.get("sellerId") || undefined;

    const validated = searchProductsSchema.safeParse({
      query,
      cursor,
      limit,
      minPrice,
      maxPrice
    });

    if (!validated.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos", details: validated.error.issues },
        { status: 400 }
      );
    }

    const result = await productsService.getProducts({
      ...validated.data,
      sellerId
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
      }
    });
  } catch (error) {
    return handleServiceError(error, "Erro ao buscar produtos");
  }
}
