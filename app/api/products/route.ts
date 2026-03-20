import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { handleServiceError } from "@/lib/handle-service-error";
import { productSchema, searchProductsSchema } from "@/schemas";
import { productsService } from "@/services/products-service";

// Get products (with search and pagination)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : undefined;
    const sellerId = searchParams.get("sellerId") || undefined;

    const validated = searchProductsSchema.safeParse({
      query,
      page,
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

    return NextResponse.json(result);
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
