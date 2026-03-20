import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { handleServiceError } from '@/lib/handle-service-error';
import { addToCartSchema, updateCartItemSchema } from '@/lib/validations';
import { cartService } from '@/services/cart-service';

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

        const cart = await cartService.getCart(session.user.id);
        return NextResponse.json(cart);
    } catch (error) {
        return handleServiceError(error, 'Erro ao buscar carrinho');
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
        const cartItem = await cartService.addToCart(session.user.id, productId, quantity);

        return NextResponse.json(
            {
                message: 'Produto adicionado ao carrinho',
                cartItem,
            },
            { status: 201 }
        );
    } catch (error) {
        return handleServiceError(error, 'Erro ao adicionar ao carrinho');
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

        const cartItem = await cartService.updateCartItem(
            session.user.id,
            productId,
            validated.data.quantity
        );

        return NextResponse.json({
            message: 'Quantidade atualizada',
            cartItem,
        });
    } catch (error) {
        return handleServiceError(error, 'Erro ao atualizar carrinho');
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

        await cartService.removeFromCart(session.user.id, productId);

        return NextResponse.json({
            message: 'Produto removido do carrinho',
        });
    } catch (error) {
        return handleServiceError(error, 'Erro ao remover do carrinho');
    }
}
