import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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

export function useFavorites(status: string) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (_error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchFavorites();
    }
  }, [status, router, fetchFavorites]);

  const handleFavoriteToggle = (productId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      // Remove from favorites list
      setFavorites(favorites.filter((fav) => fav.product.id !== productId));
    }
  };

  return {
    favorites,
    loading,
    handleFavoriteToggle
  };
}
