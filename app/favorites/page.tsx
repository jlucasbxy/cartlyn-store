"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { EmptyState, Loading, PageLayout, ProductCard } from "@/components";
import { useFavorites } from "@/hooks";

export default function FavoritesPage() {
  const router = useRouter();
  const { status } = useSession();
  const { favorites, loading, handleFavoriteToggle } = useFavorites(status);

  if (status === "loading" || loading) {
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
          onAction={() => router.push("/store")}
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
