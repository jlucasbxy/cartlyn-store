import { z } from '@/schemas/zod-config';

export const favoriteSchema = z.object({
    productId: z.cuid(),
});

export type FavoriteInput = z.infer<typeof favoriteSchema>;
