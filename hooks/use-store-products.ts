import { useState, useEffect, useRef } from 'react';

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
    const formRef = useRef<HTMLFormElement>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [minPriceFilter, setMinPriceFilter] = useState('');
    const [maxPriceFilter, setMaxPriceFilter] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: pagination.page.toString(),
                    limit: pagination.limit.toString(),
                });

                if (searchQuery) params.append('query', searchQuery);
                if (minPriceFilter) params.append('minPrice', minPriceFilter);
                if (maxPriceFilter) params.append('maxPrice', maxPriceFilter);

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
    }, [pagination.page, searchQuery, minPriceFilter, maxPriceFilter, pagination.limit]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        const searchInput = formData.get('search') as string;
        const minPrice = formData.get('minPrice') as string;
        const maxPrice = formData.get('maxPrice') as string;

        setSearchQuery(searchInput || '');
        setMinPriceFilter(minPrice || '');
        setMaxPriceFilter(maxPrice || '');
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setMinPriceFilter('');
        setMaxPriceFilter('');
        formRef.current?.reset();
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
        formRef,
        products,
        loading,
        pagination,
        handleSearch,
        handleClearFilters,
        goToPage,
        nextPage,
        previousPage,
    };
}
