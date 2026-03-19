import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addToCartSchema, updateCartItemSchema } from '@/lib/validations';
import { toNumber } from '@/lib/price';

// Get user cart
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const cartItems = await prisma.cartItem.findMany({
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

        const total = cartItems.reduce(
            (sum, item) => sum + toNumber(item.product.price) * item.quantity,
            0
        );

        return NextResponse.json({
            items: cartItems.map((item) => ({
                ...item,
                product: {
                    ...item.product,
                    price: toNumber(item.product.price),
                },
            })),
            total,
        });
    } catch (error) {
        console.error('Cart fetch error:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar carrinho' },
            { status: 500 }
        );
    }
}

// Add to cart
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
        const validated = addToCartSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: validated.error.issues },
                { status: 400 }
            );
        }

        const { productId, quantity } = validated.data;

        // Check if product exists and is active
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product || !product.active) {
            return NextResponse.json(
                { error: 'Produto não encontrado ou indisponível' },
                { status: 404 }
            );
        }

        const cartItem = await prisma.cartItem.upsert({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
            update: {
                quantity: {
                    increment: quantity,
                },
            },
            create: {
                userId: session.user.id,
                productId,
                quantity,
            },
            include: { product: true },
        });

        return NextResponse.json(
            {
                message: 'Produto adicionado ao carrinho',
                cartItem: {
                    ...cartItem,
                    product: {
                        ...cartItem.product,
                        price: toNumber(cartItem.product.price),
                    },
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Add to cart error:', error);
        return NextResponse.json(
            { error: 'Erro ao adicionar ao carrinho' },
            { status: 500 }
        );
    }
}

// Update cart item quantity
export async function PATCH(request: Request) {
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

        const body = await request.json();
        const validated = updateCartItemSchema.safeParse(body);

        if (!validated.success) {
            return NextResponse.json(
                { error: 'Dados inválidos', details: validated.error.issues },
                { status: 400 }
            );
        }

        const cartItem = await prisma.cartItem.update({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
            data: { quantity: validated.data.quantity },
            include: { product: true },
        });

        return NextResponse.json({
            message: 'Quantidade atualizada',
            cartItem: {
                ...cartItem,
                product: {
                    ...cartItem.product,
                    price: toNumber(cartItem.product.price),
                },
            },
        });
    } catch (error) {
        console.error('Update cart error:', error);
        return NextResponse.json(
            { error: 'Erro ao atualizar carrinho' },
            { status: 500 }
        );
    }
}

// Remove from cart
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

        await prisma.cartItem.delete({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        return NextResponse.json({
            message: 'Produto removido do carrinho',
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        return NextResponse.json(
            { error: 'Erro ao remover do carrinho' },
            { status: 500 }
        );
    }
}
