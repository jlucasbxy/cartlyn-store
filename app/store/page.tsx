import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { PageLayout, ProductCard } from "@/components";
import { productsService } from "@/services";
import { StoreFilters } from "./store-filters";
import { StorePagination } from "./store-pagination";

const getCachedProducts = unstable_cache(
  (params: Parameters<typeof productsService.getProducts>[0]) =>
    productsService.getProducts(params),
  ["store-products"],
  { revalidate: 60, tags: ["products"] }
);

export const metadata: Metadata = {
  title: "Loja - Cartlyn Store",
  description: "Explore nossos produtos e encontre as melhores ofertas"
};

interface StorePageProps {
  searchParams: Promise<{
    query?: string;
    cursor?: string;
    prevCursors?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function StorePage({ searchParams }: StorePageProps) {
  const params = await searchParams;

  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;

  const { products, pagination } = await getCachedProducts({
    query: params.query,
    cursor: params.cursor,
    limit: 12,
    minPrice,
    maxPrice
  });

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Loja
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Explore nossos produtos e encontre o que procura
        </p>
      </div>

      <StoreFilters />

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/30 p-16 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum produto encontrado
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <StorePagination
            hasNextPage={pagination.hasNextPage}
            nextCursor={pagination.nextCursor}
          />
        </>
      )}
    </PageLayout>
  );
}
