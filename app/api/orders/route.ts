import { NextResponse } from "next/server";
import { auth, handleServiceError } from "@/lib";
import { ordersService } from "@/services";

// Get user order history
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const orders = await ordersService.getOrders(session.user.id);
    return NextResponse.json(orders);
  } catch (error) {
    return handleServiceError(error, "Erro ao buscar histórico de pedidos");
  }
}

// Create order (checkout)
export async function POST() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const order = await ordersService.checkout(session.user.id);

    return NextResponse.json(
      {
        message: "Pedido realizado com sucesso",
        order
      },
      { status: 201 }
    );
  } catch (error) {
    return handleServiceError(error, "Erro ao finalizar pedido");
  }
}
