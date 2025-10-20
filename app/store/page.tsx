'use client';

import ProductCard from '@/components/product-card';
import Loading from '@/components/loading';
import { PageLayout } from '@/components/page-layout';
import { Card } from '@/components/card';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/button';
import { useStoreProducts } from '@/hooks/use-store-products';

export default function StorePage() {
    const {
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
    } = useStoreProducts();

    return (
        <PageLayout>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Loja</h1>

            {/* Search and Filters */}
            <Card className="mb-8">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <FormInput
                                type="text"
                                id="search"
                                label="Buscar produtos"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Nome ou descrição..."
                            />
                        </div>
                        <div>
                            <FormInput
                                type="number"
                                id="minPrice"
                                label="Preço mínimo"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="R$ 0"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <FormInput
                                type="number"
                                id="maxPrice"
                                label="Preço máximo"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="R$ 10000"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit">
                            Buscar
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleClearFilters}>
                            Limpar Filtros
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Products Grid */}
            {loading ? (
                <Loading />
            ) : products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-700 text-lg">Nenhum produto encontrado</p>
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
                            <Button
                                onClick={previousPage}
                                disabled={pagination.page === 1}
                                variant="outline"
                            >
                                Anterior
                            </Button>
                            <span className="text-gray-700 dark:text-gray-300">
                                Página {pagination.page} de {pagination.totalPages}
                            </span>
                            <Button
                                onClick={nextPage}
                                disabled={pagination.page === pagination.totalPages}
                                variant="outline"
                            >
                                Próxima
                            </Button>
                        </div>
                    )}

                    <div className="text-center mt-4 text-sm text-gray-600">
                        Total de produtos: {pagination.total}
                    </div>
                </>
            )}
        </PageLayout>
    );
}
