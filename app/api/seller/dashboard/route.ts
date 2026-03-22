import { NextResponse } from "next/server";
import { auth, handleServiceError } from "@/lib/server";
import { sellerDashboardService } from "@/services";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SELLER") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const dashboard = await sellerDashboardService.getDashboard(
      session.user.id
    );
    return NextResponse.json(dashboard);
  } catch (error) {
    return handleServiceError(error, "Erro ao buscar dados do dashboard");
  }
}
