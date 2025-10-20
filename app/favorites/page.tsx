'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ProductCard from '@/components/product-card';
import Loading from '@/components/loading';
import { PageLayout } from '@/components/page-layout';
import { EmptyState } from '@/components/empty-state';

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
            <PageLayout>
                <Loading />
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                Meus Favoritos
            </h1>

            {favorites.length === 0 ? (
                <EmptyState
                    title="Você ainda não tem produtos favoritos"
                    actionLabel="Explorar Produtos"
                    onAction={() => router.push('/store')}
                />
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
        </PageLayout>
    );
}
