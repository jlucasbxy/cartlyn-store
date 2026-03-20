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
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function useSellerProducts(itemsPerPage: number = 10) {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: itemsPerPage,
    total: 0,
    totalPages: 0
  });

  const fetchProducts = useCallback(
    async (page: number) => {
      if (!session?.user.id) return;

      setLoading(true);
      try {
        // Fetch products filtered by seller on backend
        const response = await fetch(
          `/api/products?page=${page}&limit=${itemsPerPage}&sellerId=${session.user.id}`
        );

        if (response.ok) {
          const data = await response.json();

          setProducts(data.products);
          setPagination(data.pagination);
          setCurrentPage(page);
        }
      } catch (_error) {
      } finally {
        setLoading(false);
      }
    },
    [session?.user.id, itemsPerPage]
  );

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchProducts(page);
    }
  };

  const nextPage = () => {
    if (currentPage < pagination.totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return {
    products,
    loading,
    pagination,
    currentPage,
    goToPage,
    nextPage,
    previousPage,
    refetch: () => fetchProducts(currentPage)
  };
}
