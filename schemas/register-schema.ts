import { z } from '@/schemas/zod-config';

export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(64),
    name: z.string().min(2),
    role: z.enum(['CLIENT', 'SELLER'], {
        message: 'Selecione um papel de usuário',
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
