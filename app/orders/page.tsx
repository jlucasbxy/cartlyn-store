'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar';
import Loading from '@/components/loading';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    productName: string;
    product: {
        id: string;
        name: string;
        imageUrl: string;
    };
}

interface Order {
    id: string;
    total: number;
    createdAt: string;
    items: OrderItem[];
}

export default function OrdersPage() {
    const router = useRouter();
    const { status } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status, router]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
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
                        Histórico de Pedidos
                    </h1>

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-500 text-lg mb-4">
                                Você ainda não realizou nenhum pedido
                            </p>
                            <button
                                onClick={() => router.push('/store')}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Começar a Comprar
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden"
                                >
                                    <div className="bg-gray-100 px-6 py-4 border-b">
                                        <div className="flex justify-between items-center flex-wrap gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Pedido</p>
                                                <p className="font-mono text-sm">{order.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Data</p>
                                                <p className="font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Total</p>
                                                <p className="text-xl font-bold text-indigo-600">
                                                    R$ {order.total.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4">
                                            Itens do Pedido
                                        </h3>
                                        <div className="space-y-4">
                                            {order.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex gap-4 items-center border-b pb-4 last:border-b-0"
                                                >
                                                    <div className="relative h-20 w-20 flex-shrink-0">
                                                        <Image
                                                            src={item.product.imageUrl}
                                                            alt={item.productName}
                                                            fill
                                                            className="object-cover rounded"
                                                            unoptimized
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">
                                                            {item.productName}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Quantidade: {item.quantity}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Preço unitário: R$ {item.price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-gray-900">
                                                            R$ {(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
