import { z } from '@/schemas/zod-config';
import { productSchema } from '@/schemas/product-schema';

export const productUpdateSchema = productSchema.partial();

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
