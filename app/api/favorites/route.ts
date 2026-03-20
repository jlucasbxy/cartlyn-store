import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { handleServiceError } from "@/lib/handle-service-error";
import { favoriteSchema } from "@/schemas";
import { favoritesService } from "@/services/favorites-service";

// Get user favorites
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const favorites = await favoritesService.getFavorites(session.user.id);
    return NextResponse.json(favorites);
  } catch (error) {
    return handleServiceError(error, "Erro ao buscar favoritos");
  }
}

// Add to favorites
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validated = favoriteSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validated.error.issues },
        { status: 400 }
      );
    }

    const favorite = await favoritesService.addFavorite(
      session.user.id,
      validated.data.productId
    );

    return NextResponse.json(
      { message: "Produto adicionado aos favoritos", favorite },
      { status: 201 }
    );
  } catch (error) {
    return handleServiceError(error, "Erro ao adicionar favorito");
  }
}

// Remove from favorites
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "ID do produto é obrigatório" },
        { status: 400 }
      );
    }

    await favoritesService.removeFavorite(session.user.id, productId);

    return NextResponse.json({
      message: "Produto removido dos favoritos"
    });
  } catch (error) {
    return handleServiceError(error, "Erro ao remover favorito");
  }
}
