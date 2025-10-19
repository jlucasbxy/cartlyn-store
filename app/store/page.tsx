'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import ProductCard from '@/components/product-card';
import Loading from '@/components/loading';

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

export default function StorePage() {
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

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Loja</h1>

                    {/* Search and Filters */}
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                                        Buscar produtos
                                    </label>
                                    <input
                                        type="text"
                                        id="search"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder="Nome ou descrição..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                        Preço mínimo
                                    </label>
                                    <input
                                        type="number"
                                        id="minPrice"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="R$ 0"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                        Preço máximo
                                    </label>
                                    <input
                                        type="number"
                                        id="maxPrice"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="R$ 10000"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 font-medium"
                                >
                                    Buscar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 font-medium"
                                >
                                    Limpar Filtros
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <Loading />
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 text-gray-700"
                                    >
                                        Anterior
                                    </button>
                                    <span className="text-gray-700">
                                        Página {pagination.page} de {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50 text-gray-700"
                                    >
                                        Próxima
                                    </button>
                                </div>
                            )}

                            <div className="text-center mt-4 text-sm text-gray-600">
                                Total de produtos: {pagination.total}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
