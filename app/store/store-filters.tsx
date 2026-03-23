"use client";

import type { SubmitEventHandler } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, FormInput } from "@/components";

export function StoreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    const query = formData.get("search") as string;
    const minPrice = formData.get("minPrice") as string;
    const maxPrice = formData.get("maxPrice") as string;

    if (query) params.set("query", query);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    router.push(`/store?${params}`);
  };

  const handleClearFilters = () => {
    router.push("/store");
  };

  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-200/80 dark:border-gray-700/50 p-4 sm:p-5 mb-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <FormInput
              type="text"
              id="search"
              name="search"
              label="Buscar"
              placeholder="Nome ou descrição..."
              defaultValue={searchParams.get("query") ?? ""}
            />
          </div>
          <div>
            <FormInput
              type="number"
              id="minPrice"
              name="minPrice"
              label="Preço mín."
              placeholder="R$ 0"
              min="0"
              step="0.01"
              defaultValue={searchParams.get("minPrice") ?? ""}
            />
          </div>
          <div>
            <FormInput
              type="number"
              id="maxPrice"
              name="maxPrice"
              label="Preço máx."
              placeholder="R$ 10000"
              min="0"
              step="0.01"
              defaultValue={searchParams.get("maxPrice") ?? ""}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            Buscar
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClearFilters}
          >
            Limpar
          </Button>
        </div>
      </form>
    </div>
  );
}
