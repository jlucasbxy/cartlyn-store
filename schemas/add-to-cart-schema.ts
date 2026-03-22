import { z } from "@/schemas/zod-config";

export const addToCartSchema = z.object({
  productId: z.cuid(),
  quantity: z.number().int().positive().default(1)
});

