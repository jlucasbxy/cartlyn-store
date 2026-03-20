import { z } from "@/schemas/zod-config";

export const searchProductsSchema = z.object({
  query: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().int().positive().max(100).default(20),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional()
});

export type SearchProductsInput = z.infer<typeof searchProductsSchema>;
