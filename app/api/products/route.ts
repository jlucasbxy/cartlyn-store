import { type NextRequest, NextResponse } from "next/server";
import { auth, handleServiceError } from "@/lib";
import { productSchema, searchProductsSchema } from "@/schemas";
import { productsService } from "@/services";

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

// Create product (SELLER only)
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SELLER") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validated = productSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validated.error.issues },
        { status: 400 }
      );
    }

    const product = await productsService.createProduct(
      session.user.id,
      validated.data
    );

    return NextResponse.json(
      {
        message: "Produto criado com sucesso",
        product
      },
      { status: 201 }
    );
  } catch (error) {
    return handleServiceError(error, "Erro ao criar produto");
  }
}
