import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE - Delete client account or deactivate seller account
export async function DELETE() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
        }

        const userId = session.user.id;
        const userRole = session.user.role;

        if (userRole === 'CLIENT') {
            // For clients: soft delete by deactivating the account
            // Keep all order history intact
            await prisma.$transaction([
                prisma.user.update({
                    where: { id: userId },
                    data: { active: false },
                }),
                prisma.cartItem.deleteMany({
                    where: { userId },
                }),
                prisma.favorite.deleteMany({
                    where: { userId },
                }),
            ]);

            return NextResponse.json({
                message: 'Conta excluída com sucesso. Seu histórico de compras foi preservado.'
            });
        } else if (userRole === 'SELLER') {
            // For sellers: deactivate account and hide all products
            await prisma.$transaction([
                prisma.user.update({
                    where: { id: userId },
                    data: { active: false },
                }),
                prisma.product.updateMany({
                    where: { sellerId: userId },
                    data: { active: false },
                }),
            ]);

            return NextResponse.json({
                message: 'Conta desativada com sucesso. Todos os seus produtos foram ocultados da loja.'
            });
        }

        return NextResponse.json({ error: 'Tipo de usuário inválido' }, { status: 400 });
    } catch (error) {
        console.error('Error deleting/deactivating account:', error);
        return NextResponse.json(
            { error: 'Erro ao processar solicitação' },
            { status: 500 }
        );
    }
}
