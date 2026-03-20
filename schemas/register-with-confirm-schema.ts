import { z } from '@/schemas/zod-config';
import { registerSchema } from '@/schemas/register-schema';

export const registerWithConfirmSchema = registerSchema.extend({
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não correspondem',
    path: ['confirmPassword'],
});
