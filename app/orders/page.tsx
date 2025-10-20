'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/loading';
import { PageLayout } from '@/components/page-layout';
import { EmptyState } from '@/components/empty-state';
import { Card } from '@/components/card';
import { useOrders } from '@/hooks/use-orders';

export default function OrdersPage() {
    const router = useRouter();
    const { status } = useSession();
    const { orders, loading } = useOrders(status);

    if (status === 'loading' || loading) {
        return (
            <PageLayout>
                <Loading />
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Histórico de Pedidos
            </h1>

            {orders.length === 0 ? (
                <EmptyState
                    title="Você ainda não realizou nenhum pedido"
                    actionLabel="Começar a Comprar"
                    onAction={() => router.push('/store')}
                />
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.id} padding="none" className="overflow-hidden">
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
                                                <p className="text-xl font-bold text-primary">
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
                                </Card>
                            ))}
                        </div>
                    )}
        </PageLayout>
    );
}
