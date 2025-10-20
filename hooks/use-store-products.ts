import { useState, useEffect } from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    seller: {
        id: string;
        name: string;
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export function useStoreProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: pagination.page.toString(),
                    limit: pagination.limit.toString(),
                });

                if (searchQuery) params.append('query', searchQuery);
                if (minPrice) params.append('minPrice', minPrice);
                if (maxPrice) params.append('maxPrice', maxPrice);

                const response = await fetch(`/api/products?${params}`);
                const data = await response.json();

                setProducts(data.products);
                setPagination(data.pagination);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [pagination.page, searchQuery, minPrice, maxPrice, pagination.limit]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(searchInput);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSearchInput('');
        setMinPrice('');
        setMaxPrice('');
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const goToPage = (page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    };

    const nextPage = () => {
        if (pagination.page < pagination.totalPages) {
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
        }
    };

    const previousPage = () => {
        if (pagination.page > 1) {
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        }
    };

    return {
        products,
        loading,
        pagination,
        searchInput,
        setSearchInput,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        handleSearch,
        handleClearFilters,
        goToPage,
        nextPage,
        previousPage,
    };
}
