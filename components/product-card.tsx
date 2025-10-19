'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        description: string;
        imageUrl: string;
        seller: {
            name: string;
        };
    };
    onFavoriteToggle?: (productId: string, isFavorite: boolean) => void;
    isFavorite?: boolean;
}

export default function ProductCard({ product, onFavoriteToggle, isFavorite = false }: ProductCardProps) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [favorite, setFavorite] = useState(isFavorite);

    const handleAddToCart = async () => {
        if (!session) {
            toast.warning('Por favor, faça login para adicionar ao carrinho');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id, quantity: 1 }),
            });

            if (response.ok) {
                toast.success('Produto adicionado ao carrinho!');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Erro ao adicionar ao carrinho');
            }
        } catch {
            toast.error('Erro ao adicionar ao carrinho');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (!session) {
            toast.warning('Por favor, faça login para favoritar');
            return;
        }

        setLoading(true);
        try {
            if (favorite) {
                await fetch(`/api/favorites?productId=${product.id}`, { method: 'DELETE' });
                setFavorite(false);
                onFavoriteToggle?.(product.id, false);
                toast.success('Produto removido dos favoritos');
            } else {
                await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId: product.id }),
                });
                setFavorite(true);
                onFavoriteToggle?.(product.id, true);
                toast.success('Produto adicionado aos favoritos!');
            }
        } catch {
            toast.error('Erro ao favoritar produto');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <Link href={`/products/${product.id}`}>
                <div className="relative h-48 w-full">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
            </Link>
            <div className="p-4">
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-indigo-600">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                </p>
                <p className="text-xs text-gray-600 mb-3">
                    Vendedor: {product.seller.name}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-indigo-600">
                        R$ {product.price.toFixed(2)}
                    </span>
                </div>
                {session?.user.role === 'CLIENT' && (
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={loading}
                            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
                        >
                            {loading ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                        </button>
                        <button
                            onClick={handleToggleFavorite}
                            disabled={loading}
                            className={`px-4 py-2 rounded-md border-2 ${favorite
                                ? 'bg-red-50 border-red-500 text-red-600'
                                : 'bg-white border-gray-300 text-gray-600'
                                } hover:bg-gray-50`}
                            title={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                            {favorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
