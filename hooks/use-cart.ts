import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export function useCart(status: string) {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

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

    const removeItem = async (productId: string, onConfirm: (options: {
        title: string;
        message: string;
        confirmText?: string;
        variant?: 'danger' | 'primary' | 'success';
    }) => Promise<boolean>) => {
        const confirmed = await onConfirm({
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

    const handleCheckout = async (onConfirm: (options: {
        title: string;
        message: string;
        confirmText?: string;
        variant?: 'danger' | 'primary' | 'success';
    }) => Promise<boolean>) => {
        if (cartItems.length === 0) {
            toast.warning('Seu carrinho está vazio');
            return;
        }

        const confirmed = await onConfirm({
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

    return {
        cartItems,
        total,
        loading,
        checkoutLoading,
        updateQuantity,
        removeItem,
        handleCheckout,
    };
}
