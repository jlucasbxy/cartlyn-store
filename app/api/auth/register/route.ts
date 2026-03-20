import { NextResponse } from "next/server";
import { handleServiceError } from "@/lib";
import { registerSchema } from "@/schemas";
import { registerService } from "@/services";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validated.error.issues },
        { status: 400 }
      );
    }

    const user = await registerService.registerUser(validated.data);

    return NextResponse.json(
      { message: "Usuário criado com sucesso", user },
      { status: 201 }
    );
  } catch (error) {
    return handleServiceError(error, "Erro ao criar usuário");
  }
}
