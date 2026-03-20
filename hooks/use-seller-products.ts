import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  active: boolean;
  publishedAt: string;
}

interface Pagination {
  limit: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

export function useSellerProducts(itemsPerPage: number = 10) {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>(
    []
  );
  const [pagination, setPagination] = useState<Pagination>({
    limit: itemsPerPage,
    nextCursor: null,
    hasNextPage: false
  });

  const fetchProducts = useCallback(
    async (currentCursor: string | undefined) => {
      if (!session?.user.id) return;

      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: itemsPerPage.toString(),
          sellerId: session.user.id
        });
        if (currentCursor) params.set("cursor", currentCursor);

        const response = await fetch(`/api/products?${params}`);

        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
          setPagination(data.pagination);
        }
      } catch (_error) {
      } finally {
        setLoading(false);
      }
    },
    [session?.user.id, itemsPerPage]
  );

  useEffect(() => {
    fetchProducts(undefined);
    setCursor(undefined);
    setCursorHistory([]);
  }, [fetchProducts]);

  const nextPage = () => {
    if (!pagination.hasNextPage || !pagination.nextCursor) return;
    setCursorHistory((h) => [...h, cursor]);
    setCursor(pagination.nextCursor);
    fetchProducts(pagination.nextCursor);
  };

  const previousPage = () => {
    if (cursorHistory.length === 0) return;
    const prev = cursorHistory[cursorHistory.length - 1];
    setCursorHistory((h) => h.slice(0, -1));
    setCursor(prev);
    fetchProducts(prev);
  };

  return {
    products,
    loading,
    pagination,
    hasPreviousPage: cursorHistory.length > 0,
    nextPage,
    previousPage,
    refetch: () => {
      setCursor(undefined);
      setCursorHistory([]);
      fetchProducts(undefined);
    }
  };
}
