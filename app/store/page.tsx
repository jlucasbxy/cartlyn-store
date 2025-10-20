'use client';

import ProductCard from '@/components/product-card';
import Loading from '@/components/loading';
import { PageLayout } from '@/components/page-layout';
import { Card } from '@/components/card';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/button';
import { Pagination } from '@/components/pagination';
import { useStoreProducts } from '@/hooks/use-store-products';

export default function StorePage() {
    const {
        formRef,
        products,
        loading,
        pagination,
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
                <form ref={formRef} onSubmit={handleSearch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <FormInput
                                type="text"
                                id="search"
                                name="search"
                                label="Buscar produtos"
                                placeholder="Nome ou descrição..."
                            />
                        </div>
                        <div>
                            <FormInput
                                type="number"
                                id="minPrice"
                                name="minPrice"
                                label="Preço mínimo"
                                placeholder="R$ 0"
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <FormInput
                                type="number"
                                id="maxPrice"
                                name="maxPrice"
                                label="Preço máximo"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={goToPage}
                        onNext={nextPage}
                        onPrevious={previousPage}
                    />

                    <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Total de produtos: {pagination.total}
                    </div>
                </>
            )}
        </PageLayout>
    );
}
