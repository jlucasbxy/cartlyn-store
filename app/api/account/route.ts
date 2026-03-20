import { NextResponse } from "next/server";
import { auth, handleServiceError } from "@/lib";
import { accountService } from "@/services";

// DELETE - Delete client account or deactivate seller account
export async function DELETE() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const result = await accountService.deactivateOrDeleteAccount(
      session.user.id,
      session.user.role
    );

    return NextResponse.json(result);
  } catch (error) {
    return handleServiceError(error, "Erro ao processar solicitação");
  }
}
