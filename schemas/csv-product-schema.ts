import { z } from '@/schemas/zod-config';

export const csvProductSchema = z.object({
    name: z.string().min(1),
    price: z.coerce.number().finite().positive(),
    description: z.string().min(10),
    imageUrl: z.url(),
});

export type CsvProductInput = z.infer<typeof csvProductSchema>;
