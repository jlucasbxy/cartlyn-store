import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { productUpdateSchema } from '@/lib/validations';

// Get single product
export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const product = await prisma.product.findFirst({
            where: {
                id,
                active: true,
                seller: {
                    active: true, // Only show products from active sellers
                },
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Produto não encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Product fetch error:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar produto' },
            { status: 500 }
        );
    }
}

// Update product
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'SELLER') {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const validated = productUpdateSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: validated.error.issues },
                { status: 400 }
            );
        }

        // Check if product exists and belongs to seller
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Produto não encontrado' },
                { status: 404 }
            );
        }

        if (existingProduct.sellerId !== session.user.id) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 403 }
            );
        }

        const product = await prisma.product.update({
            where: { id },
            data: validated.data,
        });

        return NextResponse.json({
            message: 'Produto atualizado com sucesso',
            product,
        });
    } catch (error) {
        console.error('Product update error:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar produto' },
            { status: 500 }
        );
    }
}

// Delete product
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user || session.user.role !== 'SELLER') {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Check if product exists and belongs to seller
        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            return NextResponse.json(
                { error: 'Produto não encontrado' },
                { status: 404 }
            );
        }

        if (existingProduct.sellerId !== session.user.id) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 403 }
            );
        }

        // Soft delete: set active to false instead of hard delete
        // This preserves order history and prevents foreign key constraint errors
        await prisma.product.update({
            where: { id },
            data: { active: false },
        });

        return NextResponse.json({
            message: 'Produto excluído com sucesso',
        });
    } catch (error) {
        console.error('Product deletion error:', error);
        return NextResponse.json(
            { error: 'Erro ao excluir produto' },
            { status: 500 }
        );
    }
}
