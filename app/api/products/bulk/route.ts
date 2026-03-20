import { NextResponse } from "next/server";
import Papa from "papaparse";
import { auth } from "@/lib/auth";
import { handleServiceError } from "@/lib/handle-service-error";
import { csvProductSchema } from "@/schemas";
import { productsService } from "@/services/products-service";

export async function POST(request: Request): Promise<Response> {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "SELLER") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    const text = await file.text();

    return new Promise((resolve) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const validProducts = [];
            const errors = [];

            for (let i = 0; i < results.data.length; i++) {
              const row = results.data[i];
              const validated = csvProductSchema.safeParse(row);

              if (validated.success) {
                validProducts.push(validated.data);
              } else {
                errors.push({
                  row: i + 1,
                  errors: validated.error.issues
                });
              }
            }

            if (validProducts.length === 0) {
              resolve(
                NextResponse.json(
                  { error: "Nenhum produto válido encontrado", errors },
                  { status: 400 }
                )
              );
              return;
            }

            const created = await productsService.createBulkProducts(
              session.user.id,
              validProducts
            );

            resolve(
              NextResponse.json({
                message: `${created} produtos criados com sucesso`,
                created,
                errors: errors.length > 0 ? errors : undefined
              })
            );
          } catch (error) {
            resolve(
              handleServiceError(error, "Erro ao criar produtos em massa")
            );
          }
        },
        error: () => {
          resolve(
            NextResponse.json(
              { error: "Erro ao processar arquivo CSV" },
              { status: 400 }
            )
          );
        }
      });
    });
  } catch (error) {
    return handleServiceError(error, "Erro ao processar requisição");
  }
}
