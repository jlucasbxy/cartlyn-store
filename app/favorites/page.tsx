'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navbar';
import ProductCard from '@/components/product-card';
import Loading from '@/components/loading';

interface Favorite {
    id: string;
    product: {
        id: string;
        name: string;
        price: number;
        description: string;
        imageUrl: string;
        seller: {
            id: string;
            name: string;
        };
    };
}

export default function FavoritesPage() {
    const router = useRouter();
    const { status } = useSession();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated') {
            fetchFavorites();
        }
    }, [status, router]);

    const fetchFavorites = async () => {
        try {
            const response = await fetch('/api/favorites');
            if (response.ok) {
                const data = await response.json();
                setFavorites(data);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteToggle = (productId: string, isFavorite: boolean) => {
        if (!isFavorite) {
            // Remove from favorites list
            setFavorites(favorites.filter((fav) => fav.product.id !== productId));
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
                        Meus Favoritos
                    </h1>

                    {favorites.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-500 text-lg mb-4">
                                Você ainda não tem produtos favoritos
                            </p>
                            <button
                                onClick={() => router.push('/store')}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                            >
                                Explorar Produtos
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {favorites.map((favorite) => (
                                <ProductCard
                                    key={favorite.id}
                                    product={favorite.product}
                                    onFavoriteToggle={handleFavoriteToggle}
                                    isFavorite={true}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
