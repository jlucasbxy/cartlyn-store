import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { handleServiceError } from "@/lib/handle-service-error";
import { sellerDashboardService } from "@/services/seller-dashboard-service";

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
