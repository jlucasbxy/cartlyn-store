import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Get user favorites
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            include: {
                product: {
                    include: {
                        seller: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(favorites);
    } catch (error) {
        console.error('Favorites fetch error:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar favoritos' },
            { status: 500 }
        );
    }
}

// Add to favorites
export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { productId } = z.object({ productId: z.string() }).parse(body);

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Produto não encontrado' },
                { status: 404 }
            );
        }

        // Create favorite (will fail if already exists due to unique constraint)
        const favorite = await prisma.favorite.create({
            data: {
                userId: session.user.id,
                productId,
            },
        });

        return NextResponse.json(
            { message: 'Produto adicionado aos favoritos', favorite },
            { status: 201 }
        );
    } catch (e) {
        const error = e as { code: string }
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Produto já está nos favoritos' },
                { status: 400 }
            );
        }
        console.error('Add favorite error:', error);
        return NextResponse.json(
            { error: 'Erro ao adicionar favorito' },
            { status: 500 }
        );
    }
}

// Remove from favorites
export async function DELETE(request: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json(
                { error: 'ID do produto é obrigatório' },
                { status: 400 }
            );
        }

        await prisma.favorite.deleteMany({
            where: {
                userId: session.user.id,
                productId,
            },
        });

        return NextResponse.json({
            message: 'Produto removido dos favoritos',
        });
    } catch (error) {
        console.error('Remove favorite error:', error);
        return NextResponse.json(
            { error: 'Erro ao remover favorito' },
            { status: 500 }
        );
    }
}
