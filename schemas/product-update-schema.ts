import { productSchema } from "@/schemas/product-schema";
import type { z } from "@/schemas/zod-config";

export const productUpdateSchema = productSchema.partial();

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
