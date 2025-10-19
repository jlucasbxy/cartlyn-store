'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar';
import Loading from '@/components/loading';

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
            }
        } catch {
            alert('Erro ao atualizar quantidade');
        }
    };

    const removeItem = async (productId: string) => {
        if (!confirm('Deseja remover este item do carrinho?')) return;

        try {
            const response = await fetch(`/api/cart?productId=${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchCart();
            }
        } catch {
            alert('Erro ao remover item');
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert('Seu carrinho está vazio');
            return;
        }

        if (!confirm(`Confirmar compra no valor de R$ ${total.toFixed(2)}?`)) {
            return;
        }

        setCheckoutLoading(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
            });

            if (response.ok) {
                alert('Pedido realizado com sucesso!');
                router.push('/orders');
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao finalizar pedido');
            }
        } catch {
            alert('Erro ao finalizar pedido');
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <>
                <Navbar />
                <Loading />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Carrinho de Compras
                    </h1>

                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-500 text-lg mb-4">
                                Seu carrinho está vazio
                            </p>
                            <button
                                onClick={() => router.push('/store')}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-lg shadow-md p-6 flex gap-4"
                                    >
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
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Vendedor: {item.product.seller.name}
                                            </p>
                                            <p className="text-lg font-bold text-indigo-600 mt-2">
                                                R$ {item.product.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => removeItem(item.product.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Remover
                                            </button>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.product.id, item.quantity - 1)
                                                    }
                                                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                                                >
                                                    -
                                                </button>
                                                <span className="w-12 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        updateQuantity(item.product.id, item.quantity + 1)
                                                    }
                                                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2">
                                                Subtotal: R${' '}
                                                {(item.product.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">
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
                                            <div className="flex justify-between text-xl font-bold text-gray-900">
                                                <span>Total</span>
                                                <span>R$ {total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCheckout}
                                        disabled={checkoutLoading}
                                        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
                                    >
                                        {checkoutLoading ? 'Finalizando...' : 'Finalizar Compra'}
                                    </button>
                                    <button
                                        onClick={() => router.push('/store')}
                                        className="w-full mt-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 font-medium"
                                    >
                                        Continuar Comprando
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
