import { productSchema } from "@/schemas/product-schema";

export const productUpdateSchema = productSchema.partial();
