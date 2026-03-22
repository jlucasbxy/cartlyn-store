"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import Papa from "papaparse";
import { DomainError } from "@/errors";
import { logger } from "@/lib/logger";
import { auth } from "@/lib/server";
import {
  csvProductSchema,
  productSchema,
  productUpdateSchema
} from "@/schemas";
import { z } from "@/schemas/zod-config";
import { productsService } from "@/services";
import type { ActionResult } from "./types";

export async function createProduct(data: {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || session.user.role !== "SELLER")
    return { error: "Não autorizado" };
  const validated = productSchema.safeParse(data);
  if (!validated.success) return { error: "Dados inválidos" };
  try {
    await productsService.createProduct(session.user.id, validated.data);
    revalidatePath("/seller/products");
    revalidateTag("products", "max");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "createProduct failed");
    return { error: "Erro ao criar produto" };
  }
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    price?: number;
    description?: string;
    imageUrl?: string;
    active?: boolean;
  }
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || session.user.role !== "SELLER")
    return { error: "Não autorizado" };
  const validated = productUpdateSchema.safeParse(data);
  if (!validated.success) return { error: "Dados inválidos" };
  try {
    await productsService.updateProduct(session.user.id, id, validated.data);
    revalidatePath("/seller/products");
    revalidateTag("products", "max");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "updateProduct failed");
    return { error: "Erro ao atualizar produto" };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || session.user.role !== "SELLER")
    return { error: "Não autorizado" };
  try {
    await productsService.deleteProduct(session.user.id, id);
    revalidatePath("/seller/products");
    revalidateTag("products", "max");
    return { success: true };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "deleteProduct failed");
    return { error: "Erro ao excluir produto" };
  }
}

export async function createBulkProducts(
  formData: FormData
): Promise<ActionResult & { message?: string }> {
  const session = await auth();
  if (!session?.user || session.user.role !== "SELLER")
    return { error: "Não autorizado" };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "Nenhum arquivo enviado" };

  const text = await file.text();
  const results = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true
  });

  const validated = z.array(csvProductSchema).safeParse(results.data);
  if (!validated.success) {
    const issues = validated.error.issues
      .map((i) => `Linha ${(i.path[0] as number) + 2}: ${i.message}`)
      .join("; ");
    return { error: `Dados inválidos — ${issues}` };
  }

  try {
    const created = await productsService.createBulkProducts(
      session.user.id,
      validated.data
    );
    revalidatePath("/seller/products");
    revalidateTag("products", "max");
    return {
      success: true,
      message: `${created} produtos criados com sucesso`
    };
  } catch (error) {
    if (error instanceof DomainError) return { error: error.message };
    logger.error({ err: error }, "createBulkProducts failed");
    return { error: "Erro ao criar produtos em massa" };
  }
}
