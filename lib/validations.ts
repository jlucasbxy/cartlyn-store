import { z } from 'zod';

// User validations
export const registerSchema = z.object({
    email: z.email(),
    password: z.string().min(8).max(64),
    name: z.string().min(2),
    role: z.enum(['CLIENT', 'SELLER'], {
        message: 'Selecione um papel de usuário',
    }),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

// Product validations
export const productSchema = z.object({
    name: z.string().min(1).max(200),
    price: z.number().positive(),
    description: z.string().min(10),
    imageUrl: z.url(),
});

export const productUpdateSchema = productSchema.partial();

// CSV Product validation
export const csvProductSchema = z.object({
    name: z.string().min(1),
    price: z.string().transform((val) => parseFloat(val)),
    description: z.string().min(10),
    imageUrl: z.url(),
});

// Cart validations
export const addToCartSchema = z.object({
    productId: z.cuid(),
    quantity: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
    quantity: z.number().int().positive(),
});

// Search and pagination
export const searchProductsSchema = z.object({
    query: z.string().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(20),
    minPrice: z.number().positive().optional(),
    maxPrice: z.number().positive().optional(),
});

// Types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type CsvProductInput = z.infer<typeof csvProductSchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type SearchProductsInput = z.infer<typeof searchProductsSchema>;
