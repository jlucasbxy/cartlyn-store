import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Delete account (CLIENT) or Deactivate account (SELLER)
export async function DELETE() {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Não autorizado' },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const userRole = session.user.role;

        if (userRole === 'CLIENT') {
            // Delete client account but keep purchase history
            // We only soft delete by marking as inactive
            await prisma.user.update({
                where: { id: userId },
                data: { active: false },
            });

            return NextResponse.json({
                message: 'Conta excluída com sucesso. Histórico de compras mantido.',
            });
        } else if (userRole === 'SELLER') {
            // Deactivate seller account and hide their products
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
                message: 'Conta desativada com sucesso. Produtos ocultados.',
            });
        }

        return NextResponse.json(
            { error: 'Papel de usuário inválido' },
            { status: 400 }
        );
    } catch (error) {
        console.error('User deletion error:', error);
        return NextResponse.json(
            { error: 'Erro ao processar solicitação' },
            { status: 500 }
        );
    }
}
