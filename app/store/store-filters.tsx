'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/card';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/button';

export function StoreFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const params = new URLSearchParams();

        const query = formData.get('search') as string;
        const minPrice = formData.get('minPrice') as string;
        const maxPrice = formData.get('maxPrice') as string;

        if (query) params.set('query', query);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        params.set('page', '1');

        router.push(`/store?${params}`);
    };

    const handleClearFilters = () => {
        router.push('/store');
    };

    return (
        <Card className="mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <FormInput
                            type="text"
                            id="search"
                            name="search"
                            label="Buscar produtos"
                            placeholder="Nome ou descrição..."
                            defaultValue={searchParams.get('query') ?? ''}
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
                            defaultValue={searchParams.get('minPrice') ?? ''}
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
                            defaultValue={searchParams.get('maxPrice') ?? ''}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button type="submit">Buscar</Button>
                    <Button type="button" variant="secondary" onClick={handleClearFilters}>
                        Limpar Filtros
                    </Button>
                </div>
            </form>
        </Card>
    );
}
