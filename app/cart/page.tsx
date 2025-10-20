'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/loading';
import { PageLayout } from '@/components/page-layout';
import { EmptyState } from '@/components/empty-state';
import { Card } from '@/components/card';
import { Button } from '@/components/button';
import { ConfirmModal } from '@/components/confirm-modal';
import { useConfirm } from '@/hooks/use-confirm';
import { toast } from 'react-toastify';

interface CartItem {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        seller: {
            name: string;
        };
    };
}

export default function CartPage() {
    const router = useRouter();
    const { status } = useSession();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const { confirm, confirmState, handleClose } = useConfirm();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated') {
            fetchCart();
        }
    }, [status, router]);

    const fetchCart = async () => {
        try {
            const response = await fetch('/api/cart');
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items);
                setTotal(data.total);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch(`/api/cart?productId=${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                fetchCart();
                toast.success('Quantidade atualizada');
            }
        } catch {
            toast.error('Erro ao atualizar quantidade');
        }
    };

    const removeItem = async (productId: string) => {
        const confirmed = await confirm({
            title: 'Remover Item',
            message: 'Deseja remover este item do carrinho?',
            confirmText: 'Remover',
            variant: 'danger',
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/cart?productId=${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchCart();
                toast.success('Item removido do carrinho');
            }
        } catch {
            toast.error('Erro ao remover item');
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast.warning('Seu carrinho está vazio');
            return;
        }

        const confirmed = await confirm({
            title: 'Finalizar Compra',
            message: `Confirmar compra no valor de R$ ${total.toFixed(2)}?`,
            confirmText: 'Confirmar',
            variant: 'primary',
        });

        if (!confirmed) return;

        setCheckoutLoading(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
            });

            if (response.ok) {
                toast.success('Pedido realizado com sucesso!');
                router.push('/orders');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Erro ao finalizar pedido');
            }
        } catch {
            toast.error('Erro ao finalizar pedido');
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <PageLayout>
                <Loading />
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Carrinho de Compras
            </h1>

            {cartItems.length === 0 ? (
                <EmptyState
                    title="Seu carrinho está vazio"
                    actionLabel="Continuar Comprando"
                    onAction={() => router.push('/store')}
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <Card key={item.id} className="flex gap-4">
                                <div className="relative h-24 w-24 flex-shrink-0">
                                    <Image
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover rounded"
                                        unoptimized
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        Vendedor: {item.product.seller.name}
                                    </p>
                                    <p className="text-lg font-bold text-primary mt-2">
                                        R$ {item.product.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <Button
                                        onClick={() => removeItem(item.product.id)}
                                        variant="danger"
                                        size="sm"
                                    >
                                        Remover
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.product.id, item.quantity - 1)
                                            }
                                            className="w-8 h-8 bg-gray-200 text-gray-900 font-bold rounded hover:bg-gray-300 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center font-bold text-gray-900">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.product.id, item.quantity + 1)
                                            }
                                            className="w-8 h-8 bg-gray-200 text-gray-900 font-bold rounded hover:bg-gray-300 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Subtotal: R${' '}
                                        {(item.product.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Resumo do Pedido
                            </h2>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>R$ {total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Frete</span>
                                    <span>Grátis</span>
                                </div>
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                                        <span>Total</span>
                                        <span>R$ {total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={handleCheckout}
                                disabled={checkoutLoading}
                                fullWidth
                                size="lg"
                            >
                                {checkoutLoading ? 'Finalizando...' : 'Finalizar Compra'}
                            </Button>
                            <Button
                                onClick={() => router.push('/store')}
                                variant="secondary"
                                fullWidth
                                className="mt-2"
                            >
                                Continuar Comprando
                            </Button>
                        </Card>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmState.isOpen}
                onClose={handleClose}
                onConfirm={confirmState.onConfirm}
                title={confirmState.title}
                message={confirmState.message}
                confirmText={confirmState.confirmText}
                cancelText={confirmState.cancelText}
                variant={confirmState.variant}
            />
        </PageLayout>
    );
}
