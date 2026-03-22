"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyState, PageLayout, ProductCard } from "@/components";

interface FavoriteItem {
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

interface Props {
  initialFavorites: FavoriteItem[];
}

export function FavoritesClient({ initialFavorites }: Props) {
  const router = useRouter();
  const [favorites, setFavorites] = useState(initialFavorites);

  const handleFavoriteToggle = (productId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      setFavorites(favorites.filter((fav) => fav.product.id !== productId));
    }
  };

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Meus Favoritos
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {favorites.length === 0
            ? "Nenhum favorito ainda"
            : `${favorites.length} ${favorites.length === 1 ? "produto" : "produtos"}`}
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          title="Você ainda não tem produtos favoritos"
          actionLabel="Explorar Produtos"
          onAction={() => router.push("/store")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
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
