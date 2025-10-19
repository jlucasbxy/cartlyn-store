'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar';
import Loading from '@/components/loading';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    publishedAt: string;
    seller: {
        id: string;
        name: string;
    };
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { data: session } = useSession();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${resolvedParams.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    alert('Produto não encontrado');
                    router.push('/store');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [resolvedParams.id, router]);



    const handleAddToCart = async () => {
        if (!session) {
            alert('Por favor, faça login para adicionar ao carrinho');
            router.push('/login');
            return;
        }

        setActionLoading(true);
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: resolvedParams.id, quantity }),
            });

            if (response.ok) {
                alert('Produto adicionado ao carrinho!');
                router.push('/cart');
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao adicionar ao carrinho');
            }
        } catch {
            alert('Erro ao adicionar ao carrinho');
        } finally {
            setActionLoading(false);
        }
    };

    const handleAddToFavorites = async () => {
        if (!session) {
            alert('Por favor, faça login para favoritar');
            router.push('/login');
            return;
        }

        setActionLoading(true);
        try {
            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: resolvedParams.id }),
            });

            if (response.ok) {
                alert('Produto adicionado aos favoritos!');
            } else {
                const data = await response.json();
                alert(data.error || 'Erro ao adicionar aos favoritos');
            }
        } catch {
            alert('Erro ao adicionar aos favoritos');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Loading />
            </>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button
                        onClick={() => router.back()}
                        className="mb-6 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        ← Voltar
                    </button>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                            {/* Product Image */}
                            <div className="relative h-96 w-full rounded-lg overflow-hidden">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                    {product.name}
                                </h1>

                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-indigo-600">
                                        R$ {product.price.toFixed(2)}
                                    </span>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                        Descrição
                                    </h2>
                                    <p className="text-gray-700 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Vendedor:</span>{' '}
                                        {product.seller.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Publicado em:</span>{' '}
                                        {new Date(product.publishedAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>

                                {session?.user.role === 'CLIENT' && (
                                    <div className="mt-auto">
                                        <div className="mb-4">
                                            <label
                                                htmlFor="quantity"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Quantidade
                                            </label>
                                            <input
                                                type="number"
                                                id="quantity"
                                                min="1"
                                                value={quantity}
                                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                                className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={handleAddToCart}
                                                disabled={actionLoading}
                                                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium text-lg"
                                            >
                                                {actionLoading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                                            </button>
                                            <button
                                                onClick={handleAddToFavorites}
                                                disabled={actionLoading}
                                                className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 disabled:opacity-50 font-medium"
                                                title="Adicionar aos favoritos"
                                            >
                                                ❤️
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {!session && (
                                    <div className="mt-auto">
                                        <p className="text-gray-600 mb-4">
                                            Faça login para comprar este produto
                                        </p>
                                        <button
                                            onClick={() => router.push('/login')}
                                            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium text-lg"
                                        >
                                            Fazer Login
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
