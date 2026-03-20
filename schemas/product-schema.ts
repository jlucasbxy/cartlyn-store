import { z } from '@/schemas/zod-config';

export const productSchema = z.object({
    name: z.string().min(1).max(200),
    price: z.number().positive(),
    description: z.string().min(10),
    imageUrl: z.url(),
});

export type ProductInput = z.infer<typeof productSchema>;
