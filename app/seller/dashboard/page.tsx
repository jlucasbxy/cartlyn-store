'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/components/loading';
import { PageLayout } from '@/components/page-layout';
import { StatsCard } from '@/components/stats-card';
import { Card } from '@/components/card';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/button';
import { toast } from 'react-toastify';

interface DashboardData {
    totalProducts: number;
    totalProductsSold: number;
    totalRevenue: number;
    bestSellingProduct: {
        id: string;
        name: string;
        price: number;
        imageUrl: string;
        quantitySold: number;
    } | null;
}

export default function SellerDashboardPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated') {
            if (session?.user.role !== 'SELLER') {
                toast.error('Acesso negado. Apenas vendedores podem acessar esta página.');
                router.push('/');
                return;
            }
            fetchDashboard();
        }
    }, [status, session, router]);

    const fetchDashboard = async () => {
        try {
            const response = await fetch('/api/seller/dashboard');
            if (response.ok) {
                const data = await response.json();
                setDashboardData(data);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <PageLayout>
                <Loading />
            </PageLayout>
        );
    }

    if (!dashboardData) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center">
                    <p className="text-gray-700">Erro ao carregar dashboard</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Dashboard do Vendedor
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    label="Produtos Cadastrados"
                    value={dashboardData.totalProducts}
                    bgColor="bg-blue-100"
                    icon={
                        <svg
                            className="w-8 h-8 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                    }
                />

                <StatsCard
                    label="Produtos Vendidos"
                    value={dashboardData.totalProductsSold}
                    bgColor="bg-green-100"
                    icon={
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                    }
                />

                <div className="md:col-span-2">
                    <StatsCard
                        label="Faturamento Total"
                        value={`R$ ${dashboardData.totalRevenue.toFixed(2)}`}
                        bgColor="bg-indigo-100"
                        icon={
                            <svg
                                className="w-8 h-8 text-indigo-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Best Selling Product */}
            {dashboardData.bestSellingProduct ? (
                <Card>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Produto Mais Vendido
                    </h2>
                    <div className="flex gap-6 items-center">
                        <div className="relative h-32 w-32 flex-shrink-0">
                            <Image
                                src={dashboardData.bestSellingProduct.imageUrl}
                                alt={dashboardData.bestSellingProduct.name}
                                fill
                                className="object-cover rounded-lg"
                                unoptimized
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                {dashboardData.bestSellingProduct.name}
                            </h3>
                            <p className="text-lg text-gray-600 mb-2">
                                Preço: R$ {dashboardData.bestSellingProduct.price.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 px-4 py-2 rounded-lg">
                                    <p className="text-sm text-gray-600">Unidades Vendidas</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {dashboardData.bestSellingProduct.quantitySold}
                                    </p>
                                </div>
                                <div className="bg-indigo-100 px-4 py-2 rounded-lg">
                                    <p className="text-sm text-gray-600">Receita Gerada</p>
                                    <p className="text-2xl font-bold text-indigo-600">
                                        R${' '}
                                        {(
                                            dashboardData.bestSellingProduct.price *
                                            dashboardData.bestSellingProduct.quantitySold
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ) : (
                <EmptyState
                    title="Nenhuma venda realizada ainda"
                    actionLabel="Cadastrar Produtos"
                    onAction={() => router.push('/seller/products')}
                />
            )}

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <Button
                        onClick={() => router.push('/seller/products')}
                        variant="outline"
                        className="w-full text-left justify-start h-auto p-0 border-0 hover:bg-transparent"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Gerenciar Produtos
                            </h3>
                            <p className="text-gray-600 font-normal">
                                Adicione, edite ou remova seus produtos
                            </p>
                        </div>
                    </Button>
                </Card>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <Button
                        onClick={() => router.push('/store')}
                        variant="outline"
                        className="w-full text-left justify-start h-auto p-0 border-0 hover:bg-transparent"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Ver Loja
                            </h3>
                            <p className="text-gray-600 font-normal">
                                Veja como seus produtos aparecem para os clientes
                            </p>
                        </div>
                    </Button>
                </Card>
            </div>
        </PageLayout>
    );
}
