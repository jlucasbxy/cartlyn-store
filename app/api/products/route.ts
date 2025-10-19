import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Prisma } from "@prisma/client"
import { productSchema, searchProductsSchema } from '@/lib/validations';

// Get products (with search and pagination)
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('query') || undefined;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const minPrice = searchParams.get('minPrice')
            ? parseFloat(searchParams.get('minPrice')!)
            : undefined;
        const maxPrice = searchParams.get('maxPrice')
            ? parseFloat(searchParams.get('maxPrice')!)
            : undefined;

        const validated = searchProductsSchema.safeParse({
            query,
            page,
            limit,
            minPrice,
            maxPrice,
        });

        if (!validated.success) {
            return NextResponse.json(
                { error: 'Parâmetros inválidos', details: validated.error.issues },
                { status: 400 }
            );
        }

        const skip = (validated.data.page - 1) * validated.data.limit;

        const where: Prisma.ProductWhereInput = {
            active: true,
        };

        if (validated.data.query) {
            where.OR = [
                { name: { contains: validated.data.query, mode: 'insensitive' } },
                { description: { contains: validated.data.query, mode: 'insensitive' } },
            ];
        }

        if (validated.data.minPrice !== undefined || validated.data.maxPrice !== undefined) {
            where.price = {};
            if (validated.data.minPrice !== undefined) {
                where.price.gte = validated.data.minPrice;
            }
            if (validated.data.maxPrice !== undefined) {
                where.price.lte = validated.data.maxPrice;
            }
        }

        const [products, total] = await prisma.$transaction([
            prisma.product.findMany({
                where,
                skip,
                take: validated.data.limit,
                orderBy: { publishedAt: 'desc' },
                include: {
                    seller: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),
            prisma.product.count({ where }),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                page: validated.data.page,
                limit: validated.data.limit,
                total,
                totalPages: Math.ceil(total / validated.data.limit),
            },
        });
    } catch (error) {
        console.error('Products fetch error:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar produtos' },
            { status: 500 }
        );
    }
}

// Create product (SELLER only)
export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'SELLER') {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validated = productSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: validated.error.issues },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                ...validated.data,
                sellerId: session.user.id,
            },
        });

        return NextResponse.json(
            { message: 'Produto criado com sucesso', product },
            { status: 201 }
        );
    } catch (error) {
        console.error('Product creation error:', error);
        return NextResponse.json(
            { error: 'Erro ao criar produto' },
            { status: 500 }
        );
    }
}
