import { NextResponse } from "next/server";
import { auth, handleServiceError } from "@/lib";
import { productUpdateSchema } from "@/schemas";
import { productsService } from "@/services";

// Get single product
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await productsService.getProductById(id);
    return NextResponse.json(product);
  } catch (error) {
    return handleServiceError(error, "Erro ao buscar produto");
  }
}

// Update product
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SELLER") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validated = productUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validated.error.issues },
        { status: 400 }
      );
    }

    const product = await productsService.updateProduct(
      session.user.id,
      id,
      validated.data
    );

    return NextResponse.json({
      message: "Produto atualizado com sucesso",
      product
    });
  } catch (error) {
    return handleServiceError(error, "Erro ao atualizar produto");
  }
}

// Delete product
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SELLER") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    await productsService.deleteProduct(session.user.id, id);

    return NextResponse.json({
      message: "Produto excluído com sucesso"
    });
  } catch (error) {
    return handleServiceError(error, "Erro ao excluir produto");
  }
}
