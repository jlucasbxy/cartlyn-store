import { z } from "@/schemas/zod-config";

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive()
});

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
